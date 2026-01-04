'use server';

import { initializeRequestServices } from '@global/di/server/get-server-dependency';
import { CheckEmailDuplicateUsecase } from '@/application/user/use-cases/check-email-duplicate.usecase';
import { getRequiredFormData } from '@/presentation/helpers/form-data.helper';

export async function checkEmailDuplicateAction(
    _: unknown,
    formData: FormData
) {
    const getService = initializeRequestServices();

    const { email } = getRequiredFormData(formData, [
        { key: 'email', error: '이메일을 입력해주세요.' },
    ]);

    const dto = {
        email: email,
    };

    const useCase = getService<CheckEmailDuplicateUsecase>(
        CheckEmailDuplicateUsecase
    );

    return await useCase.execute(dto);
}
