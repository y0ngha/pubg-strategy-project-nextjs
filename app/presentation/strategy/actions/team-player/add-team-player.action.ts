'use server';

import { initializeRequestServices } from '@global/di/server/get-server-dependency';
import { parseFormData } from '@/presentation/helpers/form-data.helper';
import { AddTeamPlayerUseCase } from '@/application/strategy/use-cases/team-player/add-team-player.usecase';

export async function addTeamPlayerAction(_: unknown, formData: FormData) {
    const getService = initializeRequestServices();

    const { userId, strategyId } = parseFormData(formData, [
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
    ] as const);

    const useCase = getService(AddTeamPlayerUseCase);

    const dto = {
        actorId: userId,
        strategyId: strategyId,
    };

    return await useCase.execute(dto);
}
