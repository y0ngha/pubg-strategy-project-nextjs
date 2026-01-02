'use server';

import { initializeRequestServices } from '@global/di/server/get-server-dependency';
import { WithdrawalUseCase } from '@/application/user/use-cases/withdrawal.usecase';

export async function withdrawalUserAction(_: unknown, formData: FormData) {
    const getService = initializeRequestServices();

    const id = formData.get('id')?.toString();

    if (id === undefined) {
        throw new Error('유저 고유 식별자를 불러올 수 없습니다.');
    }

    const dto = {
        id: id,
    };

    const useCase = getService<WithdrawalUseCase>(WithdrawalUseCase);

    return await useCase.execute(dto);
}
