'use server';

import { initializeRequestServices } from '@global/di/server/get-server-dependency';
import { DeleteCircleUseCase } from '@/application/strategy/use-cases/circle/delete-circle.usecase';
import { parseFormData } from '@/(presentation)/shared/helpers/form-data.helper';

export type DeleteCircleAction = { circleId: string };

export async function deleteCircleAction(
    formData: FormData
): Promise<DeleteCircleAction> {
    const getService = initializeRequestServices();

    const { userId, strategyId, circleId } = parseFormData(formData, [
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
            key: 'circleId',
            error: '자기장 고유 식별자를 불러올 수 없습니다.',
            type: 'string',
        },
    ] as const);

    const useCase = getService(DeleteCircleUseCase);

    const dto = {
        actorId: userId,
        strategyId: strategyId,
        circleId: circleId,
    };

    return await useCase.execute(dto);
}
