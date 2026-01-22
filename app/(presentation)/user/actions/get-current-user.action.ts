'use server';

import { initializeRequestServices } from '@global/di/server/get-server-dependency';
import { GetCurrentUserUseCase } from '@/application/user/use-cases/get-current-user.usecase';
import { ServerAction } from '@/(presentation)/shared/types/server-action';
import { GetCurrentUserResponseDto } from '@/application/user/dto/get-current-user.dto';
import { isAuthenticationComplete } from '@/(presentation)/shared/helpers/authentication.helper';

export type GetCurrentUserAction = ServerAction<GetCurrentUserResponseDto>;

export async function getCurrentUserAction(): Promise<GetCurrentUserAction> {
    const getService = initializeRequestServices();

    const isLoggedIn = await isAuthenticationComplete();

    if (!isLoggedIn) {
        return {
            isSuccess: false,
            isError: false,
            errorMessage: undefined,
            data: undefined,
        };
    }

    try {
        const useCase = getService<GetCurrentUserUseCase>(
            GetCurrentUserUseCase
        );

        const user = await useCase.execute();

        return {
            isSuccess: true,
            isError: false,
            data: {
                ...user,
            },
        };
    } catch (e) {
        throw e;
    }
}
