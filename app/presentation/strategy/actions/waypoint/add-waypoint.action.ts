'use server';

import { initializeRequestServices } from '@global/di/server/get-server-dependency';
import { parseFormData } from '@/presentation/helpers/form-data.helper';
import { AddWaypointUseCase } from '@/application/strategy/use-cases/waypoint/add-waypoint.usecase';

export async function addWaypointAction(_: unknown, formData: FormData) {
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
