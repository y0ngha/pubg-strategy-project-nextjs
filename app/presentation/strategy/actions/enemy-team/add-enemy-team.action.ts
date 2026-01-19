'use server';

import { initializeRequestServices } from '@global/di/server/get-server-dependency';
import { parseFormData } from '@/presentation/helpers/form-data.helper';
import { AddEnemyTeamUseCase } from '@/application/strategy/use-cases/enemy-team/add-enemy-team.usecase';

export async function addEnemyTeamAction(_: unknown, formData: FormData) {
    const getService = initializeRequestServices();

    const { userId, strategyId, teamLabel } = parseFormData(formData, [
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
            key: 'teamLabel',
            error: '팀 라벨을 불러올 수 없습니다.',
            type: 'string',
        },
    ] as const);

    const useCase = getService(AddEnemyTeamUseCase);

    const dto = {
        actorId: userId,
        strategyId: strategyId,
        teamLabel: teamLabel,
    };

    return await useCase.execute(dto);
}
