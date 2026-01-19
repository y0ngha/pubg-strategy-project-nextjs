'use server';

import { initializeRequestServices } from '@global/di/server/get-server-dependency';
import { parseFormData } from '@/presentation/helpers/form-data.helper';
import { UpdateEnemyTeamUseCase } from '@/application/strategy/use-cases/enemy-team/update-enemy-team.usecase';

export async function updateEnemyTeamAction(_: unknown, formData: FormData) {
    const getService = initializeRequestServices();

    const { userId, strategyId, enemyTeamId, teamLabel, positionX, positionY } =
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
            { key: 'positionX', type: 'number', allowUndefined: true },
            { key: 'positionY', type: 'number', allowUndefined: true },
        ] as const);

    const useCase = getService(UpdateEnemyTeamUseCase);

    const hasPosition = positionX != null && positionY != null;

    const dto = {
        actorId: userId,
        strategyId: strategyId,
        enemyTeamId: enemyTeamId,
        teamLabel: teamLabel,
        ...(hasPosition && {
            position: {
                x: positionX,
                y: positionY,
            },
        }),
    };

    return await useCase.execute(dto);
}
