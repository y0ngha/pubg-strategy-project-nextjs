'use server';

import { initializeRequestServices } from '@global/di/server/get-server-dependency';
import { GetFriendshipListUseCase } from '@/application/friend/use-cases/get-friendship-list.usecase';
import { getRequiredFormData } from '@/presentation/helpers/form-data.helper';

export async function getFriendshipListAction(_: unknown, formData: FormData) {
    const getService = initializeRequestServices();

    const { userId } = getRequiredFormData(formData, [
        { key: 'userId', error: '유저 고유 식별자를 불러올 수 없습니다.' },
    ]);

    const dto = {
        userId: userId,
    };

    const useCase = getService<GetFriendshipListUseCase>(
        GetFriendshipListUseCase
    );

    return await useCase.execute(dto);
}
