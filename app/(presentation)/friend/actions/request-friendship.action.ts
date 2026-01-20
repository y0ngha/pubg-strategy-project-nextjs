'use server';

import { initializeRequestServices } from '@global/di/server/get-server-dependency';
import { RequestFriendshipUseCase } from '@/application/friend/use-cases/request-friendship.usecase';
import { parseFormData } from '@/(presentation)/helpers/form-data.helper';

export async function requestFriendshipAction(_: unknown, formData: FormData) {
    const getService = initializeRequestServices();

    const { userId, recipientUserId } = parseFormData(formData, [
        {
            key: 'userId',
            error: '유저 고유 식별자를 불러올 수 없습니다.',
            type: 'string',
        },
        {
            key: 'recipientUserId',
            error: '친구 요청을 받는 유저 고유 식별자를 불러올 수 없습니다.',
            type: 'string',
        },
    ] as const);

    const dto = {
        requesterUserId: userId,
        recipientUserId: recipientUserId,
    };

    const useCase = getService<RequestFriendshipUseCase>(
        RequestFriendshipUseCase
    );

    return await useCase.execute(dto);
}
