'use server';

import { initializeRequestServices } from '@global/di/server/get-server-dependency';
import { GetStrategyResponseDto } from '@/application/strategy/dto/strategy/get-strategy.dto';
import { ensureAuthentication } from '@/(presentation)/shared/helpers/authentication.helper';
import { GetStrategyUseCase } from '@/application/strategy/use-cases/strategy/get-strategy.usecase';

export type GetStrategyAction = GetStrategyResponseDto;

export async function getStrategyAction(strategyId: string) {
    await ensureAuthentication();

    const getService = initializeRequestServices();

    const useCase = getService(GetStrategyUseCase);

    const dto = {
        strategyId: strategyId,
    };

    return await useCase.execute(dto);
}
