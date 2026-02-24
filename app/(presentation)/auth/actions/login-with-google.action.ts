'use server';

import { initializeRequestServices } from '@global/di/server/get-server-dependency';
import { LoginWithGoogleUseCase } from '@/application/user/use-cases/login-with-google.usecase';
import { parseFormData } from '@/(presentation)/shared/helpers/form-data.helper';
import {
    saveTokensByCookieStore,
    saveUserIdByCookieStore,
} from '@/(presentation)/users/services/authentication-save.service';

export async function loginWithGoogleAction(_: unknown, formData: FormData) {
    const getService = initializeRequestServices();

    const { email, token } = parseFormData(formData, [
        {
            key: 'email',
            error: '이메일은 필수적으로 입력해야합니다.',
            type: 'string',
        },
        { key: 'token', error: '토큰 값이 비어있습니다.', type: 'string' },
    ] as const);

    const dto = {
        email: email,
        googleToken: token,
    };

    const useCase = getService<LoginWithGoogleUseCase>(LoginWithGoogleUseCase);

    const { accessToken, refreshToken, user } = await useCase.execute(dto);

    await saveTokensByCookieStore(accessToken, refreshToken);
    await saveUserIdByCookieStore(user.id);

    return {
        id: user.id,
        email: user.email,
    };
}
