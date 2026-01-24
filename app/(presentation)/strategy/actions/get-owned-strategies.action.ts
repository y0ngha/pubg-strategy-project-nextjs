import { initializeRequestServices } from '@global/di/server/get-server-dependency';
import { ensureAuthentication } from '@/(presentation)/shared/helpers/authentication.helper';
import { GetOwnedStrategiesUseCase } from '@/application/strategy/use-cases/get-owned-strategies.usecase';
import { GetStrategyResponseDto } from '@/application/strategy/dto/strategy/get-strategy.dto';

export type GetOwnedStrategiesAction = GetStrategyResponseDto[];

export async function getOwnedStrategiesAction(
    userId: string,
    page: number,
    limit: number
): Promise<GetOwnedStrategiesAction> {
    const getService = initializeRequestServices();

    await ensureAuthentication();

    try {
        const useCase = getService(GetOwnedStrategiesUseCase);

        const dto = {
            actorId: userId,
            page,
            limit,
        };

        const strategies = await useCase.execute(dto);

        return {
            ...strategies,
        };
    } catch (e) {
        throw e;
    }
}
