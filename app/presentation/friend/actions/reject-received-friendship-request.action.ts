'use server';

import { initializeRequestServices } from '@global/di/server/get-server-dependency';
import { RejectReceivedFriendshipUseCase } from '@/application/friend/use-cases/reject-received-friendship.usecase';

export async function rejectReceivedFriendshipRequestAction(
    _: unknown,
    formData: FormData
) {
    const getService = initializeRequestServices();

    const id = formData.get('id')?.toString();
    const userId = formData.get('userId')?.toString();

    if (id === undefined) {
        throw new Error('친구 고유 식별자를 불러올 수 없습니다.');
    }

    if (userId === undefined) {
        throw new Error('유저 고유 식별자를 불러올 수 없습니다.');
    }

    const dto = {
        id: id,
        userId: userId,
    };

    const useCase = getService<RejectReceivedFriendshipUseCase>(
        RejectReceivedFriendshipUseCase
    );

    return await useCase.execute(dto);
}
