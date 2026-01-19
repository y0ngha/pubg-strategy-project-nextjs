'use server';

import { initializeRequestServices } from '@global/di/server/get-server-dependency';
import { RegisterWithEmailUseCase } from '@/application/user/use-cases/register-with-email.usecase';
import { parseFormData } from '@/presentation/helpers/form-data.helper';

export async function registerWithEmailAction(_: unknown, formData: FormData) {
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

    const useCase = getService<RegisterWithEmailUseCase>(
        RegisterWithEmailUseCase
    );

    return await useCase.execute(dto);
}
