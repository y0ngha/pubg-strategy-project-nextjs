'use server';

import { CreateCircleUseCase } from '@/application/strategy/use-cases/circle/create-circle.usecase';
import { initializeRequestServices } from '@global/di/server/get-server-dependency';
import { parseFormData } from '@/(presentation)/shared/helpers/form-data.helper';
import { Position } from '@/application/strategy/types/position';
import { ensureAuthentication } from '@/(presentation)/shared/helpers/authentication.helper';

export type CreateCircleAction = {
    id: string;
    centerPosition: Position;
    phase: number;
    radius: number;
    color: string;
};

export async function createCircleAction(
    formData: FormData
): Promise<CreateCircleAction> {
    const getService = initializeRequestServices();

    await ensureAuthentication();

    const { userId, strategyId, phase, position } = parseFormData(formData, [
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
            key: 'phase',
            error: '자기장 페이즈를 불러올 수 없습니다.',
            type: 'number',
        },
        {
            key: 'position',
            error: '자기장 위치를 불러올 수 없습니다.',
            type: 'position',
        },
    ] as const);

    const useCase = getService(CreateCircleUseCase);

    const dto = {
        actorId: userId,
        strategyId: strategyId,
        phase: phase,
        position: position,
    };

    return await useCase.execute(dto);
}
