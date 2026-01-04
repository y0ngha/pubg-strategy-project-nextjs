'use server';

import { initializeRequestServices } from '@global/di/server/get-server-dependency';
import { RequestFriendshipUseCase } from '@/application/friend/use-cases/request-friendship.usecase';

export async function requestFriendshipAction(_: unknown, formData: FormData) {
    const getService = initializeRequestServices();

    const requesterUserId = formData.get('userId')?.toString();
    const recipientUserId = formData.get('recipientUserId')?.toString();

    if (requesterUserId === undefined) {
        throw new Error('유저 고유 식별자를 불러올 수 없습니다.');
    }

    if (recipientUserId === undefined) {
        throw new Error(
            '친구 요청을 받는 유저 고유 식별자를 불러올 수 없습니다.'
        );
    }

    const dto = {
        requesterUserId: requesterUserId,
        recipientUserId: recipientUserId,
    };

    const useCase = getService<RequestFriendshipUseCase>(
        RequestFriendshipUseCase
    );

    return await useCase.execute(dto);
}
