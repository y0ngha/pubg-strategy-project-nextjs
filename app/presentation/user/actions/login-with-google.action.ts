'use server';

import { initializeRequestServices } from '@global/di/server/get-server-dependency';
import { LoginWithGoogleUseCase } from '@/application/user/use-cases/login-with-google.usecase';
import { getRequiredFormData } from '@/presentation/helpers/form-data.helper';

export async function loginWithGoogleAction(_: unknown, formData: FormData) {
    const getService = initializeRequestServices();

    const { email, token } = getRequiredFormData(formData, [
        { key: 'email', error: '이메일은 필수적으로 입력해야합니다.' },
        { key: 'token', error: '토큰 값이 비어있습니다.' },
    ]);

    const dto = {
        email: email,
        token: token,
    };

    const useCase = getService<LoginWithGoogleUseCase>(LoginWithGoogleUseCase);

    return await useCase.execute(dto);
}
