'use server';

import { initializeRequestServices } from '@global/di/server/get-server-dependency';
import { CheckEmailDuplicateUsecase } from '@/application/user/use-cases/check-email-duplicate.usecase';
import { parseFormData } from '@/(presentation)/shared/helpers/form-data.helper';

export async function checkEmailDuplicateAction(
    _: unknown,
    formData: FormData
) {
    const getService = initializeRequestServices();

    const { email } = parseFormData(formData, [
        { key: 'email', error: '이메일을 입력해주세요.', type: 'string' },
    ] as const);

    const dto = {
        email: email,
    };

    const useCase = getService<CheckEmailDuplicateUsecase>(
        CheckEmailDuplicateUsecase
    );

    return await useCase.execute(dto);
}
