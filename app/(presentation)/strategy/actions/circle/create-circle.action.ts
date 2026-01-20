'use server';

import { CreateCircleUseCase } from '@/application/strategy/use-cases/circle/create-circle.usecase';
import { initializeRequestServices } from '@global/di/server/get-server-dependency';
import { parseFormData } from '@/(presentation)/helpers/form-data.helper';

export async function createCircleAction(_: unknown, formData: FormData) {
    const getService = initializeRequestServices();

    const { userId, strategyId, phase } = parseFormData(formData, [
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
    ] as const);

    const useCase = getService(CreateCircleUseCase);

    const dto = {
        actorId: userId,
        strategyId: strategyId,
        phase: phase,
    };

    return await useCase.execute(dto);
}
