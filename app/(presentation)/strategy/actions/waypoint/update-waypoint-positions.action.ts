'use server';

import { initializeRequestServices } from '@global/di/server/get-server-dependency';
import { parseFormData } from '@/(presentation)/shared/helpers/form-data.helper';
import { ensureAuthentication } from '@/(presentation)/shared/helpers/authentication.helper';
import { UpdateWaypointPositionsUseCase } from '@/application/strategy/use-cases/waypoint/update-waypoint-positions.usecase';

export type UpdateWaypointPositionsAction = {
    teamPlayerId: string;
    positions: { x: number; y: number }[];
};

export async function updateWaypointPositionsAction(
    formData: FormData
): Promise<UpdateWaypointPositionsAction> {
    await ensureAuthentication();

    const getService = initializeRequestServices();

    const { strategyId, teamPlayerId, waypointId, positions } = parseFormData(
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
                key: 'waypointId',
                error: '웨이포인트 고유 식별자를 불러올 수 없습니다.',
                type: 'string',
            },
            {
                key: 'positions',
                error: '웨이포인트 위치를 불러올 수 없습니다.',
                type: 'position',
                isArray: true,
            },
        ] as const
    );

    const useCase = getService(UpdateWaypointPositionsUseCase);

    const dto = {
        strategyId: strategyId,
        teamPlayerId: teamPlayerId,
        waypointId: waypointId,
        positions: positions,
    };

    return await useCase.execute(dto);
}
