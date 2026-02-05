'use server';

import { initializeRequestServices } from '@global/di/server/get-server-dependency';
import { DeleteAirplanePathUseCase } from '@/application/strategy/use-cases/airplane-path/delete-airplane-path.usecase';
import { parseFormData } from '@/(presentation)/shared/helpers/form-data.helper';

export type DeleteAirplanePathAction = { airplanePathId: string };

export async function deleteAirplanePathAction(
    formData: FormData
): Promise<DeleteAirplanePathAction> {
    const getService = initializeRequestServices();

    const { userId, strategyId, airplanePathId } = parseFormData(formData, [
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
        {
            key: 'airplanePathId',
            error: '비행기 동선 고유 식별자를 불러올 수 없습니다.',
            type: 'string',
        },
    ] as const);

    const useCase = getService<DeleteAirplanePathUseCase>(
        DeleteAirplanePathUseCase
    );

    const dto = {
        actorId: userId,
        strategyId: strategyId,
        airplanePathId: airplanePathId,
    };

    return await useCase.execute(dto);
}
