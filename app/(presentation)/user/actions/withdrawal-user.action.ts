'use server';

import { initializeRequestServices } from '@global/di/server/get-server-dependency';
import { WithdrawalUseCase } from '@/application/user/use-cases/withdrawal.usecase';
import { ensureAuthentication } from '@/(presentation)/shared/helpers/authentication.helper';

export async function withdrawalUserAction() {
    await ensureAuthentication();

    const getService = initializeRequestServices();

    const useCase = getService<WithdrawalUseCase>(WithdrawalUseCase);

    return await useCase.execute();
}
