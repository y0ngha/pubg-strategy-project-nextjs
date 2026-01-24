'use server';

import { initializeRequestServices } from '@global/di/server/get-server-dependency';
import { GetStrategiesUseCase } from '@/application/strategy/use-cases/get-strategies.usecase';
import { GetStrategiesResponseDto } from '@/application/strategy/dto/strategy/get-strategy.dto';
import { ensureAuthentication } from '@/(presentation)/shared/helpers/authentication.helper';

export type GetStrategiesAction = GetStrategiesResponseDto;

export async function getStrategiesAction(
    userId: string
): Promise<GetStrategiesAction> {
    const getService = initializeRequestServices();

    await ensureAuthentication();

    try {
        const useCase = getService(GetStrategiesUseCase);

        const dto = {
            actorId: userId,
        };

        const strategies = await useCase.execute(dto);

        return {
            ...strategies,
        };
    } catch (e) {
        throw e;
    }
}
