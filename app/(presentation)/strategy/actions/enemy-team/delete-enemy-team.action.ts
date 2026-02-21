'use server';

import { initializeRequestServices } from '@global/di/server/get-server-dependency';
import { parseFormData } from '@/(presentation)/shared/helpers/form-data.helper';
import { DeleteEnemyTeamUseCase } from '@/application/strategy/use-cases/enemy-team/delete-enemy-team.usecase';
import { ensureAuthentication } from '@/(presentation)/shared/helpers/authentication.helper';

export type DeleteEnemyTeamAction = { enemyTeamId: string };

export async function deleteEnemyTeamAction(
    formData: FormData
): Promise<DeleteEnemyTeamAction> {
    await ensureAuthentication();

    const getService = initializeRequestServices();

    const { strategyId, enemyTeamId } = parseFormData(formData, [
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
    ] as const);

    const useCase = getService(DeleteEnemyTeamUseCase);

    const dto = {
        strategyId: strategyId,
        enemyTeamId: enemyTeamId,
    };

    return await useCase.execute(dto);
}
