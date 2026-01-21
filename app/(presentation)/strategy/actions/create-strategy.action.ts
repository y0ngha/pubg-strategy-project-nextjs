'use server';

import { initializeRequestServices } from '@global/di/server/get-server-dependency';
import { parseFormData } from '@/(presentation)/helpers/form-data.helper';
import { CreateStrategyUseCase } from '@/application/strategy/use-cases/create-strategy.usecase';

export async function createStrategyAction(_: unknown, formData: FormData) {
    const getService = initializeRequestServices();

    const { userId, title, map } = parseFormData(formData, [
        {
            key: 'userId',
            error: '유저 고유 식별자를 불러올 수 없습니다.',
            type: 'string',
        },
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
        actorId: userId,
        title: title,
        map: map,
    };

    return await useCase.execute(dto);
}
