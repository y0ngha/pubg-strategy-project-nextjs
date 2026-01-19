'use server';

import { initializeRequestServices } from '@global/di/server/get-server-dependency';
import { parseFormData } from '@/presentation/helpers/form-data.helper';
import { UpdateMarkerUseCase } from '@/application/strategy/use-cases/marker/update-marker.usecase';

export async function updateMarkerAction(_: unknown, formData: FormData) {
    const getService = initializeRequestServices();

    const { userId, strategyId, markerId, positionX, positionY } =
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
                key: 'markerId',
                error: '마커 고유 식별자를 불러올 수 없습니다.',
                type: 'string',
            },
            {
                key: 'positionX',
                error: '마커 위치를 불러올 수 없습니다.',
                type: 'number',
            },
            {
                key: 'positionY',
                error: '마커 위치를 불러올 수 없습니다.',
                type: 'number',
            },
        ] as const);

    const useCase = getService(UpdateMarkerUseCase);

    const dto = {
        actorId: userId,
        strategyId: strategyId,
        teamPlayerId: markerId,
        position: {
            x: positionX,
            y: positionY,
        },
    };

    return await useCase.execute(dto);
}
