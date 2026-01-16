import { UserRepositoryPort } from '@/domain/user/port/out/user-repository.port';
import { CheckEmailDuplicateUsecase } from '@/application/user/use-cases/check-email-duplicate.usecase';
import { getUserRepositoryMocking } from '@/__tests__/application/helpers/repository-mocking.helpers';

describe('CheckEmailDuplicate', () => {
    let useCase: CheckEmailDuplicateUsecase;
    let mockUserRepository: jest.Mocked<UserRepositoryPort>;

    beforeEach(() => {
        mockUserRepository = getUserRepositoryMocking();

        useCase = new CheckEmailDuplicateUsecase(mockUserRepository);
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
