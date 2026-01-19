'use server';

import { initializeRequestServices } from '@global/di/server/get-server-dependency';
import { UpdateCircleUseCase } from '@/application/strategy/use-cases/circle/update-circle.usecase';
import { parseFormData } from '@/presentation/helpers/form-data.helper';

export async function updateCircleAction(_: unknown, formData: FormData) {
    const getService = initializeRequestServices();

    const {
        userId,
        strategyId,
        circleId,
        phase,
        centerPositionX,
        centerPositionY,
    } = parseFormData(formData, [
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
        { key: 'centerPositionX', type: 'number', allowUndefined: true },
        { key: 'centerPositionY', type: 'number', allowUndefined: true },
    ] as const);

    const useCase = getService(UpdateCircleUseCase);

    const hasPosition = centerPositionX != null && centerPositionY != null;

    const dto = {
        actorId: userId,
        strategyId: strategyId,
        circleId: circleId,
        phase: phase,
        ...(hasPosition && {
            centerPosition: {
                x: centerPositionX,
                y: centerPositionY,
            },
        }),
    };

    return await useCase.execute(dto);
}
