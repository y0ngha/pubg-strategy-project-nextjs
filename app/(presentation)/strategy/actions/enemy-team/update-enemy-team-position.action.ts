'use server';

import { initializeRequestServices } from '@global/di/server/get-server-dependency';
import { parseFormData } from '@/(presentation)/shared/helpers/form-data.helper';
import { UpdateEnemyTeamPositionUsecase } from '@/application/strategy/use-cases/enemy-team/update-enemy-team-position.usecase';
import { ensureAuthentication } from '@/(presentation)/shared/helpers/authentication.helper';
import { Position } from '@domain/strategy/models/position.model';

export type UpdateEnemyTeamPositionAction = {
    id: string;
    position: Position;
};

export async function updateEnemyTeamPositionAction(
    formData: FormData
): Promise<UpdateEnemyTeamPositionAction> {
    await ensureAuthentication();

    const getService = initializeRequestServices();

    const { strategyId, enemyTeamId, position } = parseFormData(formData, [
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
            key: 'position',
            error: '위치를 불러올 수 없습니다.',
            type: 'position',
        },
    ] as const);

    const useCase = getService(UpdateEnemyTeamPositionUsecase);

    const dto = {
        strategyId: strategyId,
        enemyTeamId: enemyTeamId,
        position: position,
    };

    return await useCase.execute(dto);
}
