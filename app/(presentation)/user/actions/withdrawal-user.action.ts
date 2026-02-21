'use server';

import { initializeRequestServices } from '@global/di/server/get-server-dependency';
import { WithdrawalUseCase } from '@/application/user/use-cases/withdrawal.usecase';

export async function withdrawalUserAction() {
    const getService = initializeRequestServices();

    const useCase = getService<WithdrawalUseCase>(WithdrawalUseCase);

    return await useCase.execute();
}
