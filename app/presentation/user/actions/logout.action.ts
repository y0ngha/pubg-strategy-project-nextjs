'use server';

import { initializeRequestServices } from '@global/di/server/get-server-dependency';
import { LogoutUseCase } from '@/application/user/use-cases/logout.usecase';

export async function logoutAction(_: unknown, formData: FormData) {
    const getService = initializeRequestServices();

    const id = formData.get('id')?.toString();

    if (id === undefined) {
        throw new Error('유저 고유 식별자를 불러올 수 없습니다.');
    }

    const dto = {
        id: id,
    };

    const useCase = getService<LogoutUseCase>(LogoutUseCase);

    return await useCase.execute(dto);
}
