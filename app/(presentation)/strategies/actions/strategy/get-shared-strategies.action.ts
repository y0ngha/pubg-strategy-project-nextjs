'use server';

import { initializeRequestServices } from '@global/di/server/get-server-dependency';
import { ensureAuthentication } from '@/(presentation)/shared/helpers/authentication.helper';
import { GetStrategyResponseDto } from '@/application/strategy/dto/strategy/get-strategy.dto';
import { GetSharedStrategiesUseCase } from '@/application/strategy/use-cases/strategy/get-shared-strategies.usecase';

export type GetSharedStrategiesAction = {
    hasNextPage: boolean;
    data: GetStrategyResponseDto[];
};

export async function getSharedStrategiesAction(
    page: number,
    limit: number
): Promise<GetSharedStrategiesAction> {
    await ensureAuthentication();

    const getService = initializeRequestServices();

    try {
        const useCase = getService(GetSharedStrategiesUseCase);

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
