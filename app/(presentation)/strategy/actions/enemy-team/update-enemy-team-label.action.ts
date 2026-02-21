'use server';

import { initializeRequestServices } from '@global/di/server/get-server-dependency';
import { parseFormData } from '@/(presentation)/shared/helpers/form-data.helper';
import { ensureAuthentication } from '@/(presentation)/shared/helpers/authentication.helper';
import { UpdateEnemyTeamLabelUsecase } from '@/application/strategy/use-cases/enemy-team/update-enemy-team-label.usecase';

export type UpdateEnemyTeamLabelAction = {
    id: string;
    teamLabel: string;
};

export async function updateEnemyTeamLabelAction(
    formData: FormData
): Promise<UpdateEnemyTeamLabelAction> {
    await ensureAuthentication();

    const getService = initializeRequestServices();

    const { strategyId, enemyTeamId, teamLabel } = parseFormData(formData, [
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
            error: '팀 라벨을 불러올 수 없습니다.',
            type: 'string',
        },
    ] as const);

    const useCase = getService(UpdateEnemyTeamLabelUsecase);

    const dto = {
        strategyId: strategyId,
        enemyTeamId: enemyTeamId,
        teamLabel: teamLabel,
    };

    return await useCase.execute(dto);
}
