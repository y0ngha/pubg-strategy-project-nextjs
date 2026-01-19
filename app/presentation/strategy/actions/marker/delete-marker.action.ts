'use server';

import { initializeRequestServices } from '@global/di/server/get-server-dependency';
import { parseFormData } from '@/presentation/helpers/form-data.helper';
import { DeleteMarkerUseCase } from '@/application/strategy/use-cases/marker/delete-marker.usecase';

export async function deleteMarkerAction(_: unknown, formData: FormData) {
    const getService = initializeRequestServices();

    const { userId, strategyId, markerId } = parseFormData(formData, [
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
            key: 'markerId',
            error: '마커 고유 식별자를 불러올 수 없습니다.',
            type: 'string',
        },
    ] as const);

    const useCase = getService(DeleteMarkerUseCase);

    const dto = {
        actorId: userId,
        strategyId: strategyId,
        teamPlayerId: markerId,
    };

    return await useCase.execute(dto);
}
