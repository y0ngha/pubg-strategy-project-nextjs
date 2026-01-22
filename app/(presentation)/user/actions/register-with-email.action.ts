'use server';

import { initializeRequestServices } from '@global/di/server/get-server-dependency';
import { RegisterWithEmailUseCase } from '@/application/user/use-cases/register-with-email.usecase';
import { parseFormData } from '@/(presentation)/shared/helpers/form-data.helper';
import { ServerAction } from '@/(presentation)/shared/types/server-action';

type RegisterWithEmailAction = ServerAction;

export async function registerWithEmailAction(
    _: unknown,
    formData: FormData
): Promise<RegisterWithEmailAction> {
    const getService = initializeRequestServices();

    const { email, password, confirmPassword } = parseFormData(formData, [
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
        {
            key: 'confirmPassword',
            error: '비밀번호는 필수적으로 입력해야합니다.',
            type: 'string',
        },
    ] as const);

    if (password !== confirmPassword) {
        return {
            isSuccess: false,
            isError: true,
            errorMessage: '비밀번호가 일치하지 않습니다.',
            data: undefined,
        };
    }

    const dto = {
        email: email,
        password: password,
    };

    const useCase = getService<RegisterWithEmailUseCase>(
        RegisterWithEmailUseCase
    );

    return await useCase.execute(dto);
}
