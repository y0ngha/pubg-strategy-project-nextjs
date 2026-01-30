'use server';

import { initializeRequestServices } from '@global/di/server/get-server-dependency';
import { GetStrategyUseCase } from '@/application/strategy/use-cases/get-strategy.usecase';
import { GetStrategyResponseDto } from '@/application/strategy/dto/strategy/get-strategy.dto';
import { ensureAuthentication } from '@/(presentation)/shared/helpers/authentication.helper';

export type GetStrategyAction = GetStrategyResponseDto;

export async function getStrategyAction(userId: string, strategyId: string) {
    const getService = initializeRequestServices();

    await ensureAuthentication();

    const useCase = getService(GetStrategyUseCase);

    const dto = {
        actorId: userId,
        strategyId: strategyId,
    };

    return await useCase.execute(dto);
}
