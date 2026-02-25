'use server';

import { initializeRequestServices } from '@global/di/server/get-server-dependency';
import { parseFormData } from '@/(presentation)/shared/helpers/form-data.helper';
import { UpdateStrategySharePermissionUseCase } from '@/application/strategy/use-cases/share/update-strategy-share-permission.usecase';
import { ensureAuthentication } from '@/(presentation)/shared/helpers/authentication.helper';

export type UpdateStrategySharePermissionAction = {
    strategyShareId: string;
    permission: string;
    permissionLabel: string;
};

export async function updateStrategySharePermissionAction(
    formData: FormData
): Promise<UpdateStrategySharePermissionAction> {
    await ensureAuthentication();

    const getService = initializeRequestServices();

    const { strategyId, strategyShareId, permission } = parseFormData(
        formData,
        [
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
        strategyId: strategyId,
        strategyShareId: strategyShareId,
        permission: permission,
    };

    const sharedPermission = await useCase.execute(dto);

    return {
        strategyShareId: sharedPermission.strategyShareId,
        permission: sharedPermission.permission,
        permissionLabel: sharedPermission.permissionLabel,
    };
}
