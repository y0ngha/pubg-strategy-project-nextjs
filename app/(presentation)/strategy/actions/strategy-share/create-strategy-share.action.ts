'use server';

import { initializeRequestServices } from '@global/di/server/get-server-dependency';
import { parseFormData } from '@/(presentation)/shared/helpers/form-data.helper';
import { CreateStrategyShareUseCase } from '@/application/strategy/use-cases/share/create-strategy-share.usecase';

export async function createStrategyShareAction(
    _: unknown,
    formData: FormData
) {
    const getService = initializeRequestServices();

    const { userId, strategyId, targetUserId, permission } = parseFormData(
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
                key: 'targetUserId',
                error: '공유 대상 유저 고유 식별자를 불러올 수 없습니다.',
                type: 'string',
            },
            {
                key: 'permission',
                error: '공유 권한을 불러올 수 없습니다.',
                type: 'string',
            },
        ] as const
    );

    const useCase = getService(CreateStrategyShareUseCase);

    const dto = {
        actorId: userId,
        strategyId: strategyId,
        targetUserId: targetUserId,
        permission: permission,
    };

    return await useCase.execute(dto);
}
