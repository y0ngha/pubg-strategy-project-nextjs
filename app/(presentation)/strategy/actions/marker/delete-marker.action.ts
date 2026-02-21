'use server';

import { initializeRequestServices } from '@global/di/server/get-server-dependency';
import { parseFormData } from '@/(presentation)/shared/helpers/form-data.helper';
import { DeleteMarkerUseCase } from '@/application/strategy/use-cases/marker/delete-marker.usecase';

export type DeleteMarkerAction = { teamPlayerId: string; markerId: string };

export async function deleteMarkerAction(
    formData: FormData
): Promise<DeleteMarkerAction> {
    const getService = initializeRequestServices();

    const { strategyId, teamPlayerId, markerId } = parseFormData(formData, [
        {
            key: 'strategyId',
            error: '전략 고유 식별자를 불러올 수 없습니다.',
            type: 'string',
        },
        {
            key: 'teamPlayerId',
            error: '팀 플레이어 식별자를 불러올 수 없습니다.',
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
        strategyId: strategyId,
        markerId: markerId,
        teamPlayerId: teamPlayerId,
    };

    return await useCase.execute(dto);
}
