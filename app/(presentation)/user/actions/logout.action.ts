'use server';

import { initializeRequestServices } from '@global/di/server/get-server-dependency';
import { LogoutUseCase } from '@/application/user/use-cases/logout.usecase';
import { parseFormData } from '@/(presentation)/shared/helpers/form-data.helper';

export async function logoutAction(_: unknown, formData: FormData) {
    const getService = initializeRequestServices();

    const { id } = parseFormData(formData, [
        {
            key: 'id',
            error: '유저 고유 식별자를 불러올 수 없습니다.',
            type: 'string',
        },
    ] as const);

    const dto = {
        id: id,
    };

    const useCase = getService<LogoutUseCase>(LogoutUseCase);

    return await useCase.execute(dto);
}
