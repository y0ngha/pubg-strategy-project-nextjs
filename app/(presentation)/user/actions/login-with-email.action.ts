'use server';

import { initializeRequestServices } from '@global/di/server/get-server-dependency';
import { LoginWithEmailUseCase } from '@/application/user/use-cases/login-with-email.usecase';
import { parseFormData } from '@/(presentation)/helpers/form-data.helper';
import { ServerAction } from '@/(presentation)/shared/types/server-action';
import { saveTokens } from '@/(presentation)/user/services/token.service';

export type LoginWithEmailAction = ServerAction;

export async function loginWithEmailAction(
    _: unknown,
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
        const { accessToken, refreshToken } = await useCase.execute(dto);

        await saveTokens(accessToken, refreshToken);

        return {
            isSuccess: true,
            isError: false,
            errorMessage: undefined,
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
