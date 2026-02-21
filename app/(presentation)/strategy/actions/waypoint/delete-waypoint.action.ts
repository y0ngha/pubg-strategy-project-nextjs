'use server';

import { initializeRequestServices } from '@global/di/server/get-server-dependency';
import { parseFormData } from '@/(presentation)/shared/helpers/form-data.helper';
import { DeleteWaypointUseCase } from '@/application/strategy/use-cases/waypoint/delete-waypoint.usecase';
import { ensureAuthentication } from '@/(presentation)/shared/helpers/authentication.helper';

export type DeleteWaypointAction = { teamPlayerId: string; waypointId: string };

export async function deleteWaypointAction(
    formData: FormData
): Promise<DeleteWaypointAction> {
    await ensureAuthentication();

    const getService = initializeRequestServices();

    const { strategyId, teamPlayerId, waypointId } = parseFormData(formData, [
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
    ] as const);

    const useCase = getService(DeleteWaypointUseCase);

    const dto = {
        strategyId: strategyId,
        teamPlayerId: teamPlayerId,
        waypointId: waypointId,
    };

    return await useCase.execute(dto);
}
