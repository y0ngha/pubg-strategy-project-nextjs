'use server';

import { initializeRequestServices } from '@global/di/server/get-server-dependency';
import { GetCurrentUserUseCase } from '@/application/user/use-cases/get-current-user.usecase';
import { getRequiredFormData } from '@/presentation/helpers/form-data.helper';

export async function getCurrentUserAction(_: unknown, formData: FormData) {
    const getService = initializeRequestServices();

    const { id } = getRequiredFormData(formData, [
        { key: 'id', error: '유저 고유 식별자를 불러올 수 없습니다.' },
    ]);

    const dto = {
        id: id,
    };

    const useCase = getService<GetCurrentUserUseCase>(GetCurrentUserUseCase);

    return await useCase.execute(dto);
}
