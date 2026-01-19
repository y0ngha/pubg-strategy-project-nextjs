'use server';

import { initializeRequestServices } from '@global/di/server/get-server-dependency';
import { parseFormData } from '@/presentation/helpers/form-data.helper';
import { DeleteEnemyTeamUseCase } from '@/application/strategy/use-cases/enemy-team/delete-enemy-team.usecase';

export async function deleteEnemyTeamAction(_: unknown, formData: FormData) {
    const getService = initializeRequestServices();

    const { userId, strategyId, enemyTeamId } = parseFormData(formData, [
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
    ] as const);

    const useCase = getService(DeleteEnemyTeamUseCase);

    const dto = {
        actorId: userId,
        strategyId: strategyId,
        enemyTeamId: enemyTeamId,
    };

    return await useCase.execute(dto);
}
