'use server';

import { initializeRequestServices } from '@global/di/server/get-server-dependency';
import { parseFormData } from '@/(presentation)/shared/helpers/form-data.helper';
import { AddEnemyTeamUseCase } from '@/application/strategy/use-cases/enemy-team/add-enemy-team.usecase';
import { Position } from '@/application/strategy/types/position';
import { ensureAuthentication } from '@/(presentation)/shared/helpers/authentication.helper';

export type AddEnemyTeamAction = {
    id: string;
    teamLabel: string;
    position: Position;
};

export async function addEnemyTeamAction(
    formData: FormData
): Promise<AddEnemyTeamAction> {
    await ensureAuthentication();

    const getService = initializeRequestServices();

    const { userId, strategyId, teamLabel, position } = parseFormData(
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
                key: 'teamLabel',
                error: '팀 라벨을 불러올 수 없습니다.',
                type: 'string',
            },
            {
                key: 'position',
                error: '위치를 불러올 수 없습니다.',
                type: 'position',
            },
        ] as const
    );

    const useCase = getService(AddEnemyTeamUseCase);

    const dto = {
        actorId: userId,
        strategyId: strategyId,
        teamLabel: teamLabel,
        position: position,
    };

    return await useCase.execute(dto);
}
