import { initializeRequestServices } from '@global/di/server/get-server-dependency';
import { ensureAuthentication } from '@/(presentation)/shared/helpers/authentication.helper';
import { GetStrategyResponseDto } from '@/application/strategy/dto/strategy/get-strategy.dto';
import { GetSharedStrategiesUseCase } from '@/application/strategy/use-cases/get-shared-strategies.usecase';

export type GetSharedStrategiesAction = GetStrategyResponseDto[];

export async function getSharedStrategiesAction(
    userId: string,
    page: number,
    limit: number
): Promise<GetSharedStrategiesAction> {
    const getService = initializeRequestServices();

    await ensureAuthentication();

    try {
        const useCase = getService(GetSharedStrategiesUseCase);

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
