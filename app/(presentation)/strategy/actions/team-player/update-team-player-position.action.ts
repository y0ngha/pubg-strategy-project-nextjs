'use server';

import { initializeRequestServices } from '@global/di/server/get-server-dependency';
import { parseFormData } from '@/(presentation)/shared/helpers/form-data.helper';
import { MoveTeamPlayerUseCase } from '@/application/strategy/use-cases/team-player/move-team-player.usecase';

export type UpdateTeamPlayerPositionAction = {
    id: string;
    position: { x: number; y: number };
};

export async function updateTeamPlayerPositionAction(
    formData: FormData
): Promise<UpdateTeamPlayerPositionAction> {
    const getService = initializeRequestServices();

    const { strategyId, teamPlayerId, position } = parseFormData(formData, [
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
            key: 'position',
            error: '마커 위치를 불러올 수 없습니다.',
            type: 'position',
        },
    ] as const);

    const useCase = getService(MoveTeamPlayerUseCase);

    const dto = {
        strategyId: strategyId,
        teamPlayerId: teamPlayerId,
        position: position,
    };

    return await useCase.execute(dto);
}
