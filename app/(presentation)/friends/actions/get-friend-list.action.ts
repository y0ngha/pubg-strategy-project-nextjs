'use server';

import { initializeRequestServices } from '@global/di/server/get-server-dependency';
import { GetFriendListUseCase } from '@/application/friend/use-cases/get-friend-list.usecase';
import { ensureAuthentication } from '@/(presentation)/shared/helpers/authentication.helper';
import { GetFriendListResponseDto } from '@/application/friend/dto/get-friend-list.dto';

export type GetFriendListAction = GetFriendListResponseDto;

export async function getFriendListAction(): Promise<GetFriendListAction> {
    await ensureAuthentication();

    const getService = initializeRequestServices();
    const useCase = getService<GetFriendListUseCase>(GetFriendListUseCase);

    return await useCase.execute();
}
