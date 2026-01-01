import { UserRepositoryPort } from '@domain/user/port/out/user-repository.port';
import { PasswordCipherPort } from '@domain/user/port/out/password-cipher.port';
import { ChangePasswordUseCase } from '@/application/user/use-cases/change-password.usecase';
import { PasswordValidatorService } from '@domain/user/services/password-validator.service';
import { ChangePasswordRequestSchema } from '@/application/user/dto/change-password.dto';
import { UserId } from '@domain/shared/value-objects/user-id';
import { User } from '@domain/user/entities/user.entity';
import { Email } from '@domain/shared/value-objects/email';
import { Password } from '@domain/user/value-objects/password';
import { AuthProvider } from '@domain/user/enums/AuthProvider.enum';
import {
    ChangePasswordException,
    InvalidPasswordException,
} from '@domain/user/exceptions/user.exceptions';

describe('ChangePasswordUseCase', () => {
    let useCase: ChangePasswordUseCase;
    let mockUserRepository: jest.Mocked<UserRepositoryPort>;
    let mockPasswordCipher: jest.Mocked<PasswordCipherPort>;
    let mockPasswordValidatorService: jest.Mocked<PasswordValidatorService>;

    beforeEach(() => {
        mockUserRepository = {
            save: jest.fn(),
            findByUserId: jest.fn(),
            delete: jest.fn(),
            existsByEmail: jest.fn(),
        } as jest.Mocked<UserRepositoryPort>;

        mockPasswordCipher = {
            encrypt: jest.fn(),
            decrypt: jest.fn(),
        } as jest.Mocked<PasswordCipherPort>;

        mockPasswordValidatorService = {
            validate: jest.fn(),
        } as jest.Mocked<PasswordValidatorService>;

        useCase = new ChangePasswordUseCase(
            mockUserRepository,
            mockPasswordCipher,
            mockPasswordValidatorService
        );

        mockUserRepository.findByUserId.mockImplementation(
            async (id: UserId): Promise<User | null> => {
                return User.reconstruct(
                    id,
                    Email.create('test@domain.com'),
                    Password.create('Abcd1234@'),
                    AuthProvider.EMAIL,
                    new Date(),
                    new Date()
                );
            }
        );

        mockPasswordCipher.encrypt.mockImplementation(value => {
            return value;
        });
    });

    describe('정상 변경', () => {
        it('현재 비밀번호가 맞고, 비밀번호 유효성이 전부 통과한다면 성공한다.', async () => {
            // Give
            const dto = {
                id: '836397c9-06ae-4fe0-82ec-5bd7d1f22700',
                currentPassword: 'Abcd1234@',
                newPassword: 'Abcd1234!',
            };

            const validateDto = ChangePasswordRequestSchema.parse(dto);

            mockPasswordValidatorService.validate.mockReturnValue(true);

            // When
            const result = await useCase.execute(validateDto);

            // Then
            expect(mockPasswordValidatorService.validate).toHaveBeenCalledTimes(
                1
            );
            expect(mockUserRepository.findByUserId).toHaveBeenCalledTimes(1);
            expect(mockUserRepository.save).toHaveBeenCalledTimes(1);

            expect(result).toBeTruthy();

            const savedUser = mockUserRepository.save.mock.calls[0][0] as User;

            expect(savedUser.password).toEqual(validateDto.newPassword);
        });
    });

    describe('변경 실패', () => {
        it('현재 비밀번호가 틀릴 경우 에러를 던진다.', async () => {
            // Give
            const dto = {
                id: '836397c9-06ae-4fe0-82ec-5bd7d1f22700',
                currentPassword: 'Asdf1234@',
                newPassword: 'Abcd1234!',
            };

            const validateDto = ChangePasswordRequestSchema.parse(dto);

            mockPasswordValidatorService.validate.mockReturnValue(true);

            // When & Then
            await expect(useCase.execute(validateDto)).rejects.toThrow(
                new ChangePasswordException('비밀번호가 일치하지 않습니다.')
            );
            expect(mockPasswordValidatorService.validate).toHaveBeenCalledTimes(
                1
            );
            expect(mockUserRepository.findByUserId).toHaveBeenCalledTimes(1);
        });

        it('현재 비밀번호가 같지만, 비밀번호 유효성 정책(이메일과 같은 경우) 에 실패했을 경우 에러를 던진다.', async () => {
            // Give
            const dto = {
                id: '836397c9-06ae-4fe0-82ec-5bd7d1f22700',
                currentPassword: 'Asdf1234@',
                newPassword: 'Test1234!',
            };

            const validateDto = ChangePasswordRequestSchema.parse(dto);

            mockPasswordValidatorService.validate.mockReturnValue(false);

            // When & Then
            await expect(useCase.execute(validateDto)).rejects.toThrow(
                new InvalidPasswordException(
                    '신규 비밀번호에 이메일이 포함될 수 없습니다.'
                )
            );
            expect(mockPasswordValidatorService.validate).toHaveBeenCalledTimes(
                1
            );
            expect(mockUserRepository.findByUserId).toHaveBeenCalledTimes(1);
        });

        it('현재 비밀번호가 같지만, 비밀번호 유효성 정책(대소문자, 특문 등) 에 실패했을 경우 에러를 던진다.', async () => {
            // Give
            const dto = {
                id: '836397c9-06ae-4fe0-82ec-5bd7d1f22700',
                currentPassword: 'Asdf1234@',
                newPassword: 'test1234!',
            };

            // When & Then
            expect(() => {
                ChangePasswordRequestSchema.parse(dto);
            }).toThrow(
                new InvalidPasswordException(
                    '비밀번호에는 최소 1글자 이상 대문자 영문이 포함되어야 합니다.'
                )
            );
        });
    });
});
