'use server';

import { initializeRequestServices } from '@global/di/server/get-server-dependency';
import { parseFormData } from '@/(presentation)/shared/helpers/form-data.helper';
import { DeleteStrategyUseCase } from '@/application/strategy/use-cases/strategy/delete-strategy.usecase';

export type DeleteStrategyAction = {
    strategyId: string;
};

export async function deleteStrategyAction(
    formData: FormData
): Promise<DeleteStrategyAction> {
    const getService = initializeRequestServices();

    const { strategyId } = parseFormData(formData, [
        {
            key: 'strategyId',
            error: '전략 고유 식별자를 불러올 수 없습니다.',
            type: 'string',
        },
    ] as const);

    const useCase = getService(DeleteStrategyUseCase);

    const dto = {
        strategyId: strategyId,
    };

    return await useCase.execute(dto);
}
