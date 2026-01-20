'use server';

import { initializeRequestServices } from '@global/di/server/get-server-dependency';
import { parseFormData } from '@/(presentation)/helpers/form-data.helper';
import { UpdateStrategySharePermissionUseCase } from '@/application/strategy/use-cases/share/update-strategy-share-permission.usecase';

export async function updateStrategySharePermissionAction(
    _: unknown,
    formData: FormData
) {
    const getService = initializeRequestServices();

    const { userId, strategyId, strategyShareId, permission } = parseFormData(
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
                key: 'strategyShareId',
                error: '전략 공유 고유 식별자를 불러올 수 없습니다.',
                type: 'string',
            },
            {
                key: 'permission',
                error: '공유 권한을 불러올 수 없습니다.',
                type: 'string',
            },
        ] as const
    );

    const useCase = getService(UpdateStrategySharePermissionUseCase);

    const dto = {
        actorId: userId,
        strategyId: strategyId,
        strategyShareId: strategyShareId,
        permission: permission,
    };

    return await useCase.execute(dto);
}
