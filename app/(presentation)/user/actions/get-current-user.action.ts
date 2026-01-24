'use server';

import { initializeRequestServices } from '@global/di/server/get-server-dependency';
import { GetCurrentUserUseCase } from '@/application/user/use-cases/get-current-user.usecase';
import { GetCurrentUserResponseDto } from '@/application/user/dto/get-current-user.dto';
import { ensureAuthentication } from '@/(presentation)/shared/helpers/authentication.helper';

export type GetCurrentUserAction = GetCurrentUserResponseDto;

export async function getCurrentUserAction(): Promise<GetCurrentUserAction> {
    const getService = initializeRequestServices();

    await ensureAuthentication();

    try {
        const useCase = getService<GetCurrentUserUseCase>(
            GetCurrentUserUseCase
        );

        const user = await useCase.execute();

        return {
            ...user,
        };
    } catch (e) {
        throw e;
    }
}
