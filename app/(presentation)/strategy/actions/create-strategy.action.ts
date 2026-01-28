'use server';

import { initializeRequestServices } from '@global/di/server/get-server-dependency';
import { parseFormData } from '@/(presentation)/shared/helpers/form-data.helper';
import { CreateStrategyUseCase } from '@/application/strategy/use-cases/create-strategy.usecase';

export type CreateStrategyAction = { id: string };

export async function createStrategyAction(
    formData: FormData
): Promise<CreateStrategyAction> {
    const getService = initializeRequestServices();

    const { userId, userEmail, title, map } = parseFormData(formData, [
        {
            key: 'userId',
            error: '유저 고유 식별자를 불러올 수 없습니다.',
            type: 'string',
        },
        {
            key: 'userEmail',
            error: '유저 이메일을 불러올 수 없습니다.',
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
        actorEmail: userEmail,
        title: title,
        map: map,
    };

    const createdStrategyId = await useCase.execute(dto);

    return {
        id: createdStrategyId,
    };
}
