'use server';

import { initializeRequestServices } from '@global/di/server/get-server-dependency';
import { RequestFriendUseCase } from '@/application/friend/use-cases/request-friend.usecase';
import { parseFormData } from '@/(presentation)/shared/helpers/form-data.helper';
import { ensureAuthentication } from '@/(presentation)/shared/helpers/authentication.helper';

export async function requestFriendAction(formData: FormData) {
    await ensureAuthentication();

    const getService = initializeRequestServices();

    const { email } = parseFormData(formData, [
        {
            key: 'email',
            error: '친구 요청을 받는 유저 고유 식별자를 불러올 수 없습니다.',
            type: 'string',
        },
    ] as const);

    const dto = {
        email: email,
    };

    const useCase = getService<RequestFriendUseCase>(RequestFriendUseCase);

    return await useCase.execute(dto);
}
