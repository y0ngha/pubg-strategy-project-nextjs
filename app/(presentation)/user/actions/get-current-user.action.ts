'use server';

import { initializeRequestServices } from '@global/di/server/get-server-dependency';
import { GetCurrentUserUseCase } from '@/application/user/use-cases/get-current-user.usecase';
import { ensureAuthentication } from '@/(presentation)/shared/helpers/authentication.helper';
import { ServerAction } from '@/(presentation)/shared/types/server-action';
import { GetCurrentUserResponseDto } from '@/application/user/dto/get-current-user.dto';

export type GetCurrentUserAction = ServerAction<GetCurrentUserResponseDto>;

export async function getCurrentUserAction(): Promise<GetCurrentUserAction> {
    const getService = initializeRequestServices();

    try {
        await ensureAuthentication();

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
        if (e instanceof Error) {
            return {
                isSuccess: false,
                isError: true,
                errorMessage: e.message,
            };
        }

        throw e;
    }
}
