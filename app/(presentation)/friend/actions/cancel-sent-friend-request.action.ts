'use server';

import { initializeRequestServices } from '@global/di/server/get-server-dependency';
import { CancelSentFriendUseCase } from '@/application/friend/use-cases/cancel-sent-friend.usecase';
import { parseFormData } from '@/(presentation)/shared/helpers/form-data.helper';

export async function cancelSentFriendRequestAction(formData: FormData) {
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

    const useCase = getService<CancelSentFriendUseCase>(
        CancelSentFriendUseCase
    );

    return await useCase.execute(dto);
}
