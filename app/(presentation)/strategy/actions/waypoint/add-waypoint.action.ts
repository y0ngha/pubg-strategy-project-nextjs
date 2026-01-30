'use server';

import { initializeRequestServices } from '@global/di/server/get-server-dependency';
import { parseFormData } from '@/(presentation)/shared/helpers/form-data.helper';
import { AddWaypointUseCase } from '@/application/strategy/use-cases/waypoint/add-waypoint.usecase';
import { Position } from '@/application/strategy/types/position';

export type AddWaypointAction = {
    id: string;
    teamPlayerId: string;
    positions: Position[];
};

export async function addWaypointAction(
    formData: FormData
): Promise<AddWaypointAction> {
    const getService = initializeRequestServices();

    const { userId, strategyId, teamPlayerId, positions } = parseFormData(
        formData,
        [
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
                key: 'teamPlayerId',
                error: '팀 플레이어 고유 식별자를 불러올 수 없습니다.',
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

    const useCase = getService(AddWaypointUseCase);

    const dto = {
        actorId: userId,
        strategyId: strategyId,
        teamPlayerId: teamPlayerId,
        positions: positions,
    };

    return await useCase.execute(dto);
}
