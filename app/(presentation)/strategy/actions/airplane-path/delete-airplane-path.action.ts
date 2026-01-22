'use server';

import { initializeRequestServices } from '@global/di/server/get-server-dependency';
import { DeleteAirplanePathUseCase } from '@/application/strategy/use-cases/airplane-path/delete-airplane-path.usecase';
import { parseFormData } from '@/(presentation)/shared/helpers/form-data.helper';

export async function deleteAirplanePathAction(_: unknown, formData: FormData) {
    const getService = initializeRequestServices();

    const { userId, strategyId } = parseFormData(formData, [
        {
            key: 'userId',
            error: '유저 고유 식별자를 불러올 수 없습니다.',
            type: 'string',
        },
        {
            key: 'strategyId',
            error: '전략 고유 식별자를 불러올 수 없습니다.',
            type: 'string',
        },
    ] as const);

    const useCase = getService<DeleteAirplanePathUseCase>(
        DeleteAirplanePathUseCase
    );

    const dto = {
        actorId: userId,
        strategyId: strategyId,
    };

    return await useCase.execute(dto);
}
