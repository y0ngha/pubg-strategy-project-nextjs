'use server';

import { initializeRequestServices } from '@global/di/server/get-server-dependency';
import { LogoutUseCase } from '@/application/user/use-cases/logout.usecase';
import { parseFormData } from '@/(presentation)/shared/helpers/form-data.helper';
import { ensureAuthentication } from '@/(presentation)/shared/helpers/authentication.helper';
import {
    deleteTokensByCookieStore,
    deleteUserIdByCookieStore,
} from '@/(presentation)/user/services/authentication-save.service';

export async function logoutAction(formData: FormData) {
    await ensureAuthentication();

    const getService = initializeRequestServices();

    const { userId } = parseFormData(formData, [
        {
            key: 'userId',
            error: '유저 고유 식별자를 불러올 수 없습니다.',
            type: 'string',
        },
    ] as const);

    const dto = {
        userId: userId,
    };

    const useCase = getService<LogoutUseCase>(LogoutUseCase);

    await useCase.execute(dto);

    await Promise.all([
        deleteTokensByCookieStore(),
        deleteUserIdByCookieStore(),
    ]);

    return true;
}
