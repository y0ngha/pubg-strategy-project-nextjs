'use server';

import { initializeRequestServices } from '@global/di/server/get-server-dependency';
import { RegisterWithEmailUseCase } from '@/application/user/use-cases/register-with-email.usecase';
import { getRequiredFormData } from '@/presentation/helpers/form-data.helper';

export async function registerWithEmailAction(_: unknown, formData: FormData) {
    const getService = initializeRequestServices();

    const { email, password } = getRequiredFormData(formData, [
        { key: 'email', error: '이메일은 필수적으로 입력해야합니다.' },
        { key: 'password', error: '비밀번호는 필수적으로 입력해야합니다.' },
    ]);

    const dto = {
        email: email,
        password: password,
    };

    const useCase = getService<RegisterWithEmailUseCase>(
        RegisterWithEmailUseCase
    );

    return await useCase.execute(dto);
}
