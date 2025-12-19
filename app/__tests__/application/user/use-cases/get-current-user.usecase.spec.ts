import { GetCurrentUserRequestSchema } from '@/application/user/dto/get-current-user.dto';
import { GetCurrentUserUseCase } from '@/application/user/use-cases/get-current-user.usecase';
import { Email } from '@/domain/shared/value-objects/email';
import { UserId } from '@/domain/shared/value-objects/user-id';
import { User } from '@/domain/user/entities/user.entity';
import { AuthProvider } from '@/domain/user/enums/AuthProvider.enum';
import { UserNotFoundException } from '@/domain/user/exceptions/user.exceptions';
import { UserRepositoryPort } from '@/domain/user/port/user-repository.port';
import { Password } from '@/domain/user/value-objects/password';

describe('GetCurrentUserUseCase', () => {
    let useCase: GetCurrentUserUseCase;
    let mockUserRepository: jest.Mocked<UserRepositoryPort>;

    beforeEach(() => {
        mockUserRepository = {
            save: jest.fn(),
            findByUserId: jest.fn(),
            existsByEmail: jest.fn(),
            delete: jest.fn(),
        } as jest.Mocked<UserRepositoryPort>;

        useCase = new GetCurrentUserUseCase(mockUserRepository);
    });

    describe('정상 조회', () => {
        it('존재하는 유저를 조회한다.', async () => {
            // Given
            const dto = {
                id: '836397c9-06ae-4fe0-82ec-5bd7d1f22700',
            };

            mockUserRepository.findByUserId.mockImplementation(
                async (id: UserId): Promise<User | null> => {
                    return User.reconstruct(
                        id,
                        Email.create('test@domain.com'),
                        Password.create('Asdf1234@'),
                        AuthProvider.EMAIL,
                        new Date(),
                        new Date()
                    );
                }
            );

            const validateDto = GetCurrentUserRequestSchema.parse(dto);

            // When
            const result = await useCase.execute(validateDto);

            // Then
            expect(mockUserRepository.findByUserId).toHaveBeenCalledTimes(1);
            expect(result.id).toBe(validateDto.id.toString());
        });

        describe('에러 처리', () => {
            it('존재하지 않는 유저를 조회했을 때 에러를 던진다.', async () => {
                // Given
                const dto = {
                    id: '836397c9-06ae-4fe0-82ec-5bd7d1f22700',
                };

                mockUserRepository.findByUserId.mockImplementation(
                    async (): Promise<User | null> => {
                        return null;
                    }
                );

                const validateDto = GetCurrentUserRequestSchema.parse(dto);

                // When & Then
                await expect(useCase.execute(validateDto)).rejects.toThrow(
                    new UserNotFoundException(validateDto.id.toString())
                );
            });
        });
    });
});
