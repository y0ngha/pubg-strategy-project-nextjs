'use server';

import { initializeRequestServices } from '@global/di/server/get-server-dependency';
import { parseFormData } from '@/(presentation)/shared/helpers/form-data.helper';
import { CreateStrategyUseCase } from '@/application/strategy/use-cases/strategy/create-strategy.usecase';

export type CreateStrategyAction = { id: string; map: string; title: string };

export async function createStrategyAction(
    formData: FormData
): Promise<CreateStrategyAction> {
    const getService = initializeRequestServices();

    const { title, map } = parseFormData(formData, [
        {
            key: 'title',
            error: '전략 제목을 불러올 수 없습니다.',
            type: 'string',
        },
        {
            key: 'map',
            error: '전략 맵을 불러올 수 없습니다.',
            type: 'string',
        },
    ] as const);

    const useCase = getService(CreateStrategyUseCase);

    const dto = {
        title: title,
        map: map,
    };

    const createdStrategy = await useCase.execute(dto);

    return {
        id: createdStrategy.id,
        map: createdStrategy.map,
        title: createdStrategy.title,
    };
}
