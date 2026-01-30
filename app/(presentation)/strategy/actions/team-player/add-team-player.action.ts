'use server';

import { initializeRequestServices } from '@global/di/server/get-server-dependency';
import { parseFormData } from '@/(presentation)/shared/helpers/form-data.helper';
import { AddTeamPlayerUseCase } from '@/application/strategy/use-cases/team-player/add-team-player.usecase';
import { Position } from '@/application/strategy/types/position';
import { ensureAuthentication } from '@/(presentation)/shared/helpers/authentication.helper';

export type AddTeamPlayerAction = {
    id: string;
    color: string;
    position: Position;
    priority: number;
};

export async function addTeamPlayerAction(
    formData: FormData
): Promise<AddTeamPlayerAction> {
    const getService = initializeRequestServices();

    await ensureAuthentication();

    const { userId, strategyId, position } = parseFormData(formData, [
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
            key: 'position',
            error: '자기장 위치를 불러올 수 없습니다.',
            type: 'position',
        },
    ] as const);

    const useCase = getService(AddTeamPlayerUseCase);

    const dto = {
        actorId: userId,
        strategyId: strategyId,
        position: position,
    };

    return await useCase.execute(dto);
}
