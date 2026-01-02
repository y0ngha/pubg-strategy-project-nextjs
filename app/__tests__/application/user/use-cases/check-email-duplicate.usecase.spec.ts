import { UserRepositoryPort } from '@/domain/user/port/out/user-repository.port';
import { CheckEmailDupliateUseCase } from '@/application/user/use-cases/check-email-dupliate.usecase';

describe('CheckEmailDuplicate', () => {
    let useCase: CheckEmailDupliateUseCase;
    let mockUserRepository: jest.Mocked<UserRepositoryPort>;

    beforeEach(() => {
        mockUserRepository = {
            save: jest.fn(),
            findByUserId: jest.fn(),
            existsByEmail: jest.fn(),
            delete: jest.fn(),
        } as jest.Mocked<UserRepositoryPort>;

        useCase = new CheckEmailDupliateUseCase(mockUserRepository);
    });

    it('이메일이 서버에 있을 때 True를 반환한다.', async () => {
        // Given
        const dto = {
            email: 'test@domain.com',
        };

        mockUserRepository.existsByEmail.mockResolvedValue(true);

        // When
        const result = await useCase.execute(dto);

        // Then
        expect(mockUserRepository.existsByEmail).toHaveBeenCalledTimes(1);
        expect(result).toBeTruthy();
    });

    it('이메일이 서버에 없을 때 False를 반환한다.', async () => {
        // Given
        const dto = {
            email: 'email@domain.com',
        };

        mockUserRepository.existsByEmail.mockResolvedValue(false);

        // When
        const result = await useCase.execute(dto);

        // Then
        expect(mockUserRepository.existsByEmail).toHaveBeenCalledTimes(1);
        expect(result).toBeFalsy();
    });
});
