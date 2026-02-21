'use server';

import { initializeRequestServices } from '@global/di/server/get-server-dependency';
import { LogoutUseCase } from '@/application/user/use-cases/logout.usecase';
import { ensureAuthentication } from '@/(presentation)/shared/helpers/authentication.helper';
import {
    deleteTokensByCookieStore,
    deleteUserIdByCookieStore,
} from '@/(presentation)/user/services/authentication-save.service';

export async function logoutAction() {
    await ensureAuthentication();

    const getService = initializeRequestServices();

    const useCase = getService<LogoutUseCase>(LogoutUseCase);

    await useCase.execute();

    await Promise.all([
        deleteTokensByCookieStore(),
        deleteUserIdByCookieStore(),
    ]);

    return true;
}
