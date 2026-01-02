'use server';

import { initializeRequestServices } from '@global/di/server/get-server-dependency';
import { CheckEmailDuplicateUsecase } from '@/application/user/use-cases/check-email-duplicate.usecase';

export async function checkEmailDuplicateAction(
    _: unknown,
    formData: FormData
) {
    const getService = initializeRequestServices();

    const email = formData.get('email')?.toString();

    if (email === undefined) {
        throw new Error('이메일을 입력해주세요.');
    }

    const dto = {
        email: email,
    };

    const useCase = getService<CheckEmailDuplicateUsecase>(
        CheckEmailDuplicateUsecase
    );

    return await useCase.execute(dto);
}
