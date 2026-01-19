'use server';

import { initializeRequestServices } from '@global/di/server/get-server-dependency';
import { parseFormData } from '@/presentation/helpers/form-data.helper';
import { UpdateStrategyUseCase } from '@/application/strategy/use-cases/update-strategy.usecase';

export async function updateStrategyAction(_: unknown, formData: FormData) {
    const getService = initializeRequestServices();

    const { userId, strategyId, title, map } = parseFormData(formData, [
        {
            key: 'userId',
            error: '유저 고유 식별자를 불러올 수 없습니다.',
            type: 'string',
        },
        {
            key: 'strategyId',
            error: '전략 고유 식별자를 불러올 수 없습니다.',
            type: 'string',
        },
        {
            key: 'title',
            type: 'string',
            allowUndefined: true,
        },
        {
            key: 'map',
            type: 'string',
            allowUndefined: true,
        },
    ] as const);

    const useCase = getService(UpdateStrategyUseCase);

    const dto = {
        actorId: userId,
        strategyId: strategyId,
        title: title,
        map: map,
    };

    return await useCase.execute(dto);
}
