import { LogoutUseCase } from '@/application/user/use-cases/logout.usecase';
import { AuthenticationServicePort } from '@/domain/user/port/out/authentication-service.port';
import { getAuthenticationServiceMocking } from '@/__tests__/application/helpers/service-mocking.helpers';

describe('LogoutUseCase', () => {
    let useCase: LogoutUseCase;
    let mockAuthenticationService: jest.Mocked<AuthenticationServicePort>;

    beforeEach(() => {
        mockAuthenticationService = getAuthenticationServiceMocking();

        useCase = new LogoutUseCase(mockAuthenticationService);
    });

    describe('로그아웃', () => {
        it('어떤 조건이던 로그아웃을 진행한다.', async () => {
            // Given
            mockAuthenticationService.logout.mockResolvedValue(true);

            // When
            const result = await useCase.execute();

            // Then
            expect(mockAuthenticationService.logout).toHaveBeenCalledTimes(1);

            expect(result).toBeTruthy();
        });

        it('Use Case 내 도메인 호출 과정에서 예외가 발생하면, 예외가 그대로 전파되어야 한다.', async () => {
            // Given
            mockAuthenticationService.logout.mockRejectedValue(new Error());

            // When & Then
            await expect(useCase.execute()).rejects.toThrow(Error);
        });
    });
});
