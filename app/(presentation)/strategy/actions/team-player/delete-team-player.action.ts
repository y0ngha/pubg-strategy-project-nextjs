'use server';

import { initializeRequestServices } from '@global/di/server/get-server-dependency';
import { parseFormData } from '@/(presentation)/shared/helpers/form-data.helper';
import { DeleteTeamPlayerUseCase } from '@/application/strategy/use-cases/team-player/delete-team-player.usecase';

export type DeleteTeamPlayerAction = { teamPlayerId: string };

export async function deleteTeamPlayerAction(
    formData: FormData
): Promise<DeleteTeamPlayerAction> {
    const getService = initializeRequestServices();

    const { strategyId, teamPlayerId } = parseFormData(formData, [
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
    ] as const);

    const useCase = getService(DeleteTeamPlayerUseCase);

    const dto = {
        strategyId: strategyId,
        teamPlayerId: teamPlayerId,
    };

    return await useCase.execute(dto);
}
