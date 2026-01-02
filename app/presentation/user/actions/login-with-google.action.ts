'use server';

import { initializeRequestServices } from '@global/di/server/get-server-dependency';
import { LoginWithGoogleUseCase } from '@/application/user/use-cases/login-with-google.usecase';

export async function loginWithGoogleAction(_: unknown, formData: FormData) {
    const getService = initializeRequestServices();

    const email = formData.get('email')?.toString();
    const token = formData.get('token')?.toString();

    if (email === undefined) {
        throw new Error('이메일은 필수적으로 입력해야합니다.');
    }

    if (token === undefined) {
        throw new Error('토큰 값이 비어있습니다.');
    }

    const dto = {
        email: email,
        token: token,
    };

    const useCase = getService<LoginWithGoogleUseCase>(LoginWithGoogleUseCase);

    return await useCase.execute(dto);
}
