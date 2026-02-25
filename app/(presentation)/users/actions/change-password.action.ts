'use server';

import { initializeRequestServices } from '@global/di/server/get-server-dependency';
import { ChangePasswordUseCase } from '@/application/user/use-cases/change-password.usecase';
import { parseFormData } from '@/(presentation)/shared/helpers/form-data.helper';
import { ensureAuthentication } from '@/(presentation)/shared/helpers/authentication.helper';

export async function changePasswordAction(formData: FormData) {
    await ensureAuthentication();

    const getService = initializeRequestServices();

    const { currentPassword, newPassword } = parseFormData(formData, [
        {
            key: 'currentPassword',
            error: '현재 비밀번호를 입력해주세요.',
            type: 'string',
        },
        {
            key: 'newPassword',
            error: '변경할 비밀번호를 입력해주세요.',
            type: 'string',
        },
    ] as const);

    const dto = {
        currentPassword: currentPassword,
        newPassword: newPassword,
    };

    const useCase = getService<ChangePasswordUseCase>(ChangePasswordUseCase);

    return await useCase.execute(dto);
}
