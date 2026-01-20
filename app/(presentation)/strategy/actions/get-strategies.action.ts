'use server';

import { initializeRequestServices } from '@global/di/server/get-server-dependency';
import { parseFormData } from '@/(presentation)/helpers/form-data.helper';
import { GetStrategiesUseCase } from '@/application/strategy/use-cases/get-strategies.usecase';

export async function getStrategiesAction(_: unknown, formData: FormData) {
    const getService = initializeRequestServices();

    const { userId } = parseFormData(formData, [
        {
            key: 'userId',
            error: '유저 고유 식별자를 불러올 수 없습니다.',
            type: 'string',
        },
    ] as const);

    const useCase = getService(GetStrategiesUseCase);

    const dto = {
        actorId: userId,
    };

    return await useCase.execute(dto);
}
