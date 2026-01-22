'use server';

import { initializeRequestServices } from '@global/di/server/get-server-dependency';
import { ChangePasswordUseCase } from '@/application/user/use-cases/change-password.usecase';
import { parseFormData } from '@/(presentation)/shared/helpers/form-data.helper';

export async function changePasswordAction(_: unknown, formData: FormData) {
    const getService = initializeRequestServices();

    const { id, currentPassword, newPassword } = parseFormData(formData, [
        {
            key: 'id',
            error: '유저 고유 식별자를 불러올 수 없습니다.',
            type: 'string',
        },
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
        id: id,
        currentPassword: currentPassword,
        newPassword: newPassword,
    };

    const useCase = getService<ChangePasswordUseCase>(ChangePasswordUseCase);

    return await useCase.execute(dto);
}
