'use server';

import { initializeRequestServices } from '@global/di/server/get-server-dependency';
import { ChangePasswordUseCase } from '@/application/user/use-cases/change-password.usecase';

export async function changePasswordAction(_: unknown, formData: FormData) {
    const getService = initializeRequestServices();

    const id = formData.get('id')?.toString();
    const currentPassword = formData.get('currentPassword')?.toString();
    const newPassword = formData.get('newPassword')?.toString();

    if (id === undefined) {
        throw new Error('유저 고유 식별자를 불러올 수 없습니다.');
    }

    if (currentPassword === undefined) {
        throw new Error('현재 비밀번호를 입력해주세요.');
    }

    if (newPassword === undefined) {
        throw new Error('변경할 비밀번호를 입력해주세요.');
    }

    const dto = {
        id: id,
        currentPassword: currentPassword,
        newPassword: newPassword,
    };

    const useCase = getService<ChangePasswordUseCase>(ChangePasswordUseCase);

    return await useCase.execute(dto);
}
