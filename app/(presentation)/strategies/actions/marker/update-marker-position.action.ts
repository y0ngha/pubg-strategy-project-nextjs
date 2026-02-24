'use server';

import { initializeRequestServices } from '@global/di/server/get-server-dependency';
import { parseFormData } from '@/(presentation)/shared/helpers/form-data.helper';
import { UpdateMarkerPositionUsecase } from '@/application/strategy/use-cases/marker/update-marker-position.usecase';
import { Position } from '@/application/strategy/types/position';
import { ensureAuthentication } from '@/(presentation)/shared/helpers/authentication.helper';

export type UpdateMarkerPositionAction = {
    teamPlayerId: string;
    position: Position;
};

export async function updateMarkerPositionAction(
    formData: FormData
): Promise<UpdateMarkerPositionAction> {
    await ensureAuthentication();

    const getService = initializeRequestServices();

    const { strategyId, teamPlayerId, markerId, position } = parseFormData(
        formData,
        [
            {
                key: 'strategyId',
                error: '전략 고유 식별자를 불러올 수 없습니다.',
                type: 'string',
            },
            {
                key: 'teamPlayerId',
                error: '팀 플레이어 고유 식별자를 불러올 수 없습니다.',
                type: 'string',
            },
            {
                key: 'markerId',
                error: '마커 고유 식별자를 불러올 수 없습니다.',
                type: 'string',
            },
            {
                key: 'position',
                error: '마커 위치를 불러올 수 없습니다.',
                type: 'position',
            },
        ] as const
    );

    const useCase = getService(UpdateMarkerPositionUsecase);

    const dto = {
        strategyId: strategyId,
        teamPlayerId: teamPlayerId,
        markerId: markerId,
        position: position,
    };

    return await useCase.execute(dto);
}
