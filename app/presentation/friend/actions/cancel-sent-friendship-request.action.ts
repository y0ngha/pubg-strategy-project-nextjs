'use server';

import { initializeRequestServices } from '@global/di/server/get-server-dependency';
import { CancelSentFriendshipUseCase } from '@/application/friend/use-cases/cancel-sent-friendship.usecase';
import { parseFormData } from '@/presentation/helpers/form-data.helper';

export async function cancelSentFriendshipRequestAction(
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

    const useCase = getService<CancelSentFriendshipUseCase>(
        CancelSentFriendshipUseCase
    );

    return await useCase.execute(dto);
}
