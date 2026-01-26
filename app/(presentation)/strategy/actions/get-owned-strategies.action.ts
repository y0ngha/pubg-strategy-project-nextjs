'use server';

import { initializeRequestServices } from '@global/di/server/get-server-dependency';
import { GetOwnedStrategiesUseCase } from '@/application/strategy/use-cases/get-owned-strategies.usecase';
import { GetStrategyResponseDto } from '@/application/strategy/dto/strategy/get-strategy.dto';

export type GetOwnedStrategiesAction = {
    hasNextPage: boolean;
    data: GetStrategyResponseDto[];
};

export async function getOwnedStrategiesAction(
    userId: string,
    page: number,
    limit: number
): Promise<GetOwnedStrategiesAction> {
    const getService = initializeRequestServices();

    // await ensureAuthentication();

    try {
        const useCase = getService(GetOwnedStrategiesUseCase);

        const dto = {
            actorId: userId,
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
