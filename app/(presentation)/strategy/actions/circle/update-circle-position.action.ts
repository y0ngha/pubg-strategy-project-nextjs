'use server';

import { initializeRequestServices } from '@global/di/server/get-server-dependency';
import { parseFormData } from '@/(presentation)/shared/helpers/form-data.helper';
import { ensureAuthentication } from '@/(presentation)/shared/helpers/authentication.helper';
import { UpdateCirclePositionUseCase } from '@/application/strategy/use-cases/circle/update-circle-position.usecase';

export type UpdateCirclePositionAction = {
    id: string;
    centerPosition: { x: number; y: number };
};

export async function updateCirclePositionAction(
    formData: FormData
): Promise<UpdateCirclePositionAction> {
    await ensureAuthentication();

    const getService = initializeRequestServices();

    const { strategyId, circleId, centerPosition } = parseFormData(formData, [
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
        {
            key: 'centerPosition',
            error: '자기장 위치를 불러올 수 없습니다.',
            type: 'position',
        },
    ] as const);

    const useCase = getService(UpdateCirclePositionUseCase);

    const dto = {
        strategyId: strategyId,
        circleId: circleId,
        centerPosition: centerPosition,
    };

    return await useCase.execute(dto);
}
