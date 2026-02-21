'use server';

import { initializeRequestServices } from '@global/di/server/get-server-dependency';
import { GetStrategyResponseDto } from '@/application/strategy/dto/strategy/get-strategy.dto';
import { ensureAuthentication } from '@/(presentation)/shared/helpers/authentication.helper';
import { GetOwnedStrategiesUseCase } from '@/application/strategy/use-cases/strategy/get-owned-strategies.usecase';

export type GetOwnedStrategiesAction = {
    hasNextPage: boolean;
    data: GetStrategyResponseDto[];
};

export async function getOwnedStrategiesAction(
    page: number,
    limit: number
): Promise<GetOwnedStrategiesAction> {
    const getService = initializeRequestServices();

    await ensureAuthentication();

    try {
        const useCase = getService(GetOwnedStrategiesUseCase);

        const dto = {
            page,
            limit,
        };

        const strategies = await useCase.execute(dto);

        return {
            hasNextPage: strategies.hasNextPage,
            data: [...strategies.data],
        };
    } catch (e) {
        throw e;
    }
}
