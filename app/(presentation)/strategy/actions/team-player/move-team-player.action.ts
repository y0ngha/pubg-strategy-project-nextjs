'use server';

import { initializeRequestServices } from '@global/di/server/get-server-dependency';
import { parseFormData } from '@/(presentation)/shared/helpers/form-data.helper';
import { MoveTeamPlayerUseCase } from '@/application/strategy/use-cases/team-player/move-team-player.usecase';

export async function moveTeamPlayerAction(_: unknown, formData: FormData) {
    const getService = initializeRequestServices();

    const { userId, strategyId, teamPlayerId, position } = parseFormData(
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
                key: 'position',
                error: '마커 위치를 불러올 수 없습니다.',
                type: 'position',
            },
        ] as const
    );

    const useCase = getService(MoveTeamPlayerUseCase);

    const dto = {
        actorId: userId,
        strategyId: strategyId,
        teamPlayerId: teamPlayerId,
        position: position,
    };

    return await useCase.execute(dto);
}
