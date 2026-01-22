'use server';

import { initializeRequestServices } from '@global/di/server/get-server-dependency';
import { UpdateCircleUseCase } from '@/application/strategy/use-cases/circle/update-circle.usecase';
import { parseFormData } from '@/(presentation)/shared/helpers/form-data.helper';

export async function updateCircleAction(_: unknown, formData: FormData) {
    const getService = initializeRequestServices();

    const { userId, strategyId, circleId, phase, centerPosition } =
        parseFormData(formData, [
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
            { key: 'phase', type: 'number', allowUndefined: true },
            { key: 'centerPosition', type: 'position', allowUndefined: true },
        ] as const);

    const useCase = getService(UpdateCircleUseCase);

    const dto = {
        actorId: userId,
        strategyId: strategyId,
        circleId: circleId,
        phase: phase,
        centerPosition: centerPosition,
    };

    return await useCase.execute(dto);
}
