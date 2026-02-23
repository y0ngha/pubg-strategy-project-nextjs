'use server';

import { initializeRequestServices } from '@global/di/server/get-server-dependency';
import { parseFormData } from '@/(presentation)/shared/helpers/form-data.helper';
import { ensureAuthentication } from '@/(presentation)/shared/helpers/authentication.helper';
import { AcceptReceivedFriendRequestUseCase } from '@/application/friend/use-cases/accept-received-friend-request.usecase';

export async function acceptReceivedFriendRequestAction(formData: FormData) {
    await ensureAuthentication();

    const getService = initializeRequestServices();

    const { id, currentStatus } = parseFormData(formData, [
        {
            key: 'id',
            error: '친구 고유 식별자를 불러올 수 없습니다.',
            type: 'string',
        },
        {
            key: 'currentStatus',
            error: '현재 친구 관계 상태를 불러올 수 없습니다.',
            type: 'string',
        },
    ] as const);

    const dto = {
        id: id,
        currentStatus: currentStatus,
    };

    const useCase = getService<AcceptReceivedFriendRequestUseCase>(
        AcceptReceivedFriendRequestUseCase
    );

    return await useCase.execute(dto);
}
