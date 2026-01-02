'use server';

import { initializeRequestServices } from '@global/di/server/get-server-dependency';
import { LoginWithEmailUseCase } from '@/application/user/use-cases/login-with-email.usecase';

export async function loginWithEmailAction(_: unknown, formData: FormData) {
    const getService = initializeRequestServices();

    const email = formData.get('email')?.toString();
    const password = formData.get('password')?.toString();

    if (email === undefined) {
        throw new Error('이메일은 필수적으로 입력해야합니다.');
    }

    if (password === undefined) {
        throw new Error('비밀번호는 필수적으로 입력해야합니다.');
    }

    const dto = {
        email: email,
        password: password,
    };

    const useCase = getService<LoginWithEmailUseCase>(LoginWithEmailUseCase);

    return await useCase.execute(dto);
}
