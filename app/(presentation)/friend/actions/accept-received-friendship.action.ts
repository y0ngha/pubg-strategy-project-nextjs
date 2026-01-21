'use server';

import { initializeRequestServices } from '@global/di/server/get-server-dependency';
import { AcceptReceivedFriendshipUseCase } from '@/application/friend/use-cases/accept-received-friendship.usecase';
import { parseFormData } from '@/(presentation)/helpers/form-data.helper';

export async function acceptReceivedFriendshipAction(
    _: unknown,
    formData: FormData
) {
    const getService = initializeRequestServices();

    const { id, userId } = parseFormData(formData, [
        {
            key: 'id',
            error: '친구 고유 식별자를 불러올 수 없습니다.',
            type: 'string',
        },
        {
            key: 'userId',
            error: '유저 고유 식별자를 불러올 수 없습니다.',
            type: 'string',
        },
    ] as const);

    const dto = {
        id: id,
        userId: userId,
    };

    const useCase = getService<AcceptReceivedFriendshipUseCase>(
        AcceptReceivedFriendshipUseCase
    );

    return await useCase.execute(dto);
}
