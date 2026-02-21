'use server';

import { initializeRequestServices } from '@global/di/server/get-server-dependency';
import { parseFormData } from '@/(presentation)/shared/helpers/form-data.helper';
import { ensureAuthentication } from '@/(presentation)/shared/helpers/authentication.helper';
import { UpdateCirclePhaseUseCase } from '@/application/strategy/use-cases/circle/update-circle-phase.usecase';

export type UpdateCirclePhaseAction = {
    id: string;
    phase: number;
    radius: number;
    color: string;
};

export async function updateCircleAction(
    formData: FormData
): Promise<UpdateCirclePhaseAction> {
    await ensureAuthentication();

    const getService = initializeRequestServices();

    const { strategyId, circleId, phase } = parseFormData(formData, [
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
            key: 'phase',
            error: '자기장 페이즈를 불러올 수 없습니다.',
            type: 'number',
        },
    ] as const);

    const useCase = getService(UpdateCirclePhaseUseCase);

    const dto = {
        strategyId: strategyId,
        circleId: circleId,
        phase: phase,
    };

    return await useCase.execute(dto);
}
