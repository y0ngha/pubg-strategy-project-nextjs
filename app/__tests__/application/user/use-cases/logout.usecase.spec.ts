import { LogoutUseCase } from '@/application/user/use-cases/logout.usecase';
import { AuthenticationServicePort } from '@/domain/user/port/out/authentication-service.port';

describe('LogoutUseCase', () => {
    let useCase: LogoutUseCase;
    let mockAuthenticationService: jest.Mocked<AuthenticationServicePort>;

    beforeEach(() => {
        mockAuthenticationService = {
            login: jest.fn(),
            logout: jest.fn(),
            googleLogin: jest.fn(),
        } as jest.Mocked<AuthenticationServicePort>;

        useCase = new LogoutUseCase(mockAuthenticationService);
    });

    describe('로그아웃', () => {
        it('어떤 조건이던 로그아웃을 진행한다.', async () => {
            // Given
            const dto = {
                id: '550e8400-e29b-41d4-a716-446655440000',
            };

            mockAuthenticationService.logout.mockResolvedValue(true);

            // When
            const result = await useCase.execute(dto);

            // Then
            expect(mockAuthenticationService.logout).toHaveBeenCalledTimes(1);

            expect(result).toBeTruthy();
        });
    });
});
