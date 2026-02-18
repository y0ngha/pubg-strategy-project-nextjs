'use server';

import { initializeRequestServices } from '@global/di/server/get-server-dependency';
import { parseFormData } from '@/(presentation)/shared/helpers/form-data.helper';
import { UpdateEnemyTeamPositionUsecase } from '@/application/strategy/use-cases/enemy-team/update-enemy-team-position.usecase';
import { ensureAuthentication } from '@/(presentation)/shared/helpers/authentication.helper';

export type UpdateEnemyTeamAction = {
    id: string;
    teamLabel: string;
    position: { x: number; y: number };
};

export async function updateEnemyTeamAction(
    formData: FormData
): Promise<UpdateEnemyTeamAction> {
    await ensureAuthentication();

    const getService = initializeRequestServices();

    const { userId, strategyId, enemyTeamId, teamLabel, position } =
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
                key: 'enemyTeamId',
                error: '적 팀 고유 식별자를 불러올 수 없습니다.',
                type: 'string',
            },
            {
                key: 'teamLabel',
                type: 'string',
                allowUndefined: true,
            },
            { key: 'position', type: 'position', allowUndefined: true },
        ] as const);

    const useCase = getService(UpdateEnemyTeamPositionUsecase);

    const dto = {
        actorId: userId,
        strategyId: strategyId,
        enemyTeamId: enemyTeamId,
        teamLabel: teamLabel,
        position: position,
    };

    return await useCase.execute(dto);
}
