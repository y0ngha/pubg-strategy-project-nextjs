import { RegisterWithEmailRequestSchema } from '@/application/user/dto/register-with-email.dto';
import { RegisterWithEmailUseCase } from '@/application/user/use-cases/register-with-email.usecase';
import { Email } from '@/domain/shared/value-objects/email';
import { User } from '@/domain/user/entities/user.entity';
import { InvalidEmailException } from '@/domain/user/exceptions/user.exceptions';
import { PasswordCipherPort } from '@/domain/user/port/password-cipher.port';
import { UserRepository } from '@/domain/user/port/user.repository';
import { PasswordValidatorService } from '@/domain/user/services/password-validator.service';
import { Password } from '@/domain/user/value-objects/password';
import { PasswordCipherAdapter } from '@/infrastructure/user/adapter/password-cipher.adapter';

describe('RegisterWithEmailUseCase', () => {
    let useCase: RegisterWithEmailUseCase;
    let mockUserRepository: jest.Mocked<UserRepository>;
    let passwordValidatorService: PasswordValidatorService;
    let passwordCipher: jest.Mocked<PasswordCipherPort>;

    beforeEach(() => {
        mockUserRepository = {
            save: jest.fn(),
            findByUserId: jest.fn(),
            existsByEmail: jest.fn(),
            delete: jest.fn(),
        } as jest.Mocked<UserRepository>;

        passwordValidatorService = new PasswordValidatorService();

        passwordCipher = {
            encrypt: jest.fn(),
            decrypt: jest.fn(),
        } as jest.Mocked<PasswordCipherPort>;

        useCase = new RegisterWithEmailUseCase(
            mockUserRepository,
            passwordValidatorService,
            passwordCipher
        );
    });

    describe('정상 회원가입', () => {
        it('유효한 이메일과 비밀번호로 회원가입한다', async () => {
            // Given
            const dto = {
                email: 'test@example.com',
                password: 'Asdf1234!',
            };

            mockUserRepository.existsByEmail.mockResolvedValue(false);
            mockUserRepository.save.mockImplementation(
                async (user: User): Promise<User> => {
                    return user;
                }
            );

            const validateDto = RegisterWithEmailRequestSchema.parse(dto);

            // When
            const result = await useCase.execute(validateDto);

            // Then
            expect(result).toEqual({
                id: expect.any(String),
                email: validateDto.email.toString(),
            });
            expect(mockUserRepository.existsByEmail).toHaveBeenCalledTimes(1);
            expect(mockUserRepository.save).toHaveBeenCalledTimes(1);

            const savedUser = mockUserRepository.save.mock.calls[0][0] as User;
            expect(savedUser).toBeInstanceOf(User);
            expect(savedUser.email.toString()).toBe(
                validateDto.email.toString()
            );
            expect(savedUser.hasPassword()).toBe(true);
        });

        describe('이메일 중복 검증', () => {
            it('이메일이 이미 존재하면 에러를 던진다', async () => {
                // Given
                const dto = {
                    email: 'existing@example.com',
                    password: 'Asdf1234!',
                };

                const validateDto = RegisterWithEmailRequestSchema.parse(dto);

                mockUserRepository.existsByEmail.mockResolvedValue(true);

                // When & Then
                await expect(useCase.execute(validateDto)).rejects.toThrow(
                    `이미 사용 중인 이메일입니다: ${validateDto.email.toString()}`
                );

                expect(mockUserRepository.save).not.toHaveBeenCalled();
            });
        });

        describe('Repository 호출 검증', () => {
            it('existsByEmail을 올바른 Email VO로 호출한다', async () => {
                // Given
                const dto = {
                    email: 'test@example.com',
                    password: 'Asdf1234!',
                };

                mockUserRepository.existsByEmail.mockResolvedValue(false);
                mockUserRepository.save.mockImplementation(
                    async (user: User): Promise<User> => {
                        return user;
                    }
                );

                const validateDto = RegisterWithEmailRequestSchema.parse(dto);
                // When
                await useCase.execute(validateDto);

                // Then
                expect(mockUserRepository.existsByEmail).toHaveBeenCalledWith(
                    expect.objectContaining({
                        toString: expect.any(Function),
                    })
                );

                const calledEmail =
                    mockUserRepository.existsByEmail.mock.calls[0][0];
                expect(calledEmail.toString()).toBe('test@example.com');
            });

            it('save를 올바른 User Entity로 호출한다', async () => {
                // Given
                const dto = {
                    email: 'test@example.com',
                    password: 'Asdf1234!',
                };

                mockUserRepository.existsByEmail.mockResolvedValue(false);
                mockUserRepository.save.mockImplementation(
                    async (user: User): Promise<User> => {
                        return user;
                    }
                );

                const validateDto = RegisterWithEmailRequestSchema.parse(dto);
                // When
                await useCase.execute(validateDto);

                // Then
                const savedUser = mockUserRepository.save.mock.calls[0][0];

                expect(savedUser).toBeInstanceOf(User);
                expect(savedUser.email.toString()).toBe('test@example.com');
                expect(savedUser.hasPassword()).toBe(true);
                expect(savedUser.id).toBeDefined();
                expect(savedUser.createdAt).toBeInstanceOf(Date);
            });
        });

        describe('에러 처리', () => {
            it('Repository 저장 실패 시 에러를 전파한다', async () => {
                // Given
                const dto = {
                    email: 'test@example.com',
                    password: 'Asdf1234!',
                };

                const validateDto = RegisterWithEmailRequestSchema.parse(dto);

                mockUserRepository.existsByEmail.mockResolvedValue(false);
                mockUserRepository.save.mockRejectedValue(
                    new Error('Internal error')
                );

                // When & Then
                await expect(useCase.execute(validateDto)).rejects.toThrow(
                    new Error('Internal error')
                );
            });

            it('Repository 조회 실패 시 에러를 전파한다', async () => {
                // Given
                const dto = {
                    email: 'test@example.com',
                    password: 'Asdf1234!',
                };

                mockUserRepository.existsByEmail.mockRejectedValue(
                    new Error('Internal error')
                );

                const validateDto = RegisterWithEmailRequestSchema.parse(dto);

                // When & Then
                await expect(useCase.execute(validateDto)).rejects.toThrow(
                    new Error('Internal error')
                );

                expect(mockUserRepository.save).not.toHaveBeenCalled();
            });
        });
    });
});
