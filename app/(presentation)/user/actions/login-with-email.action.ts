'use server';

import { initializeRequestServices } from '@global/di/server/get-server-dependency';
import { LoginWithEmailUseCase } from '@/application/user/use-cases/login-with-email.usecase';
import { parseFormData } from '@/(presentation)/shared/helpers/form-data.helper';
import {
    saveTokens,
    saveUserId,
} from '@/(presentation)/user/services/authentication-save.service';

export type LoginWithEmailAction = { id: string; email: string };

export async function loginWithEmailAction(
    formData: FormData
): Promise<LoginWithEmailAction> {
    const getService = initializeRequestServices();

    const { email, password } = parseFormData(formData, [
        {
            key: 'email',
            error: '이메일은 필수적으로 입력해야합니다.',
            type: 'string',
        },
        {
            key: 'password',
            error: '비밀번호는 필수적으로 입력해야합니다.',
            type: 'string',
        },
    ] as const);

    const dto = {
        email: email,
        password: password,
    };

    const useCase = getService<LoginWithEmailUseCase>(LoginWithEmailUseCase);

    try {
        const { accessToken, refreshToken, user } = await useCase.execute(dto);

        await saveTokens(accessToken, refreshToken);
        await saveUserId(user.id);

        return {
            id: user.id,
            email: user.email,
        };
    } catch (e) {
        throw e;
    }
}
