'use server';

import { initializeRequestServices } from '@global/di/server/get-server-dependency';
import { UpdateAirplanePathUseCase } from '@/application/strategy/use-cases/airplane-path/update-airplane-path.usecase';
import { parseFormData } from '@/(presentation)/shared/helpers/form-data.helper';
import { Position } from '@/application/strategy/types/position';

export type UpdateAirplanePathAction = {
    startPosition: Position;
    endPosition: Position;
};

export async function updateAirplanePathAction(
    formData: FormData
): Promise<UpdateAirplanePathAction> {
    const getService = initializeRequestServices();

    const { userId, strategyId, airplanePathId, startPosition, endPosition } =
        parseFormData(formData, [
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
            {
                key: 'startPosition',
                error: '비행기 동선 시작 위치를 불러올 수 없습니다.',
                type: 'position',
            },
            {
                key: 'endPosition',
                error: '비행기 동선 종료 위치를 불러올 수 없습니다.',
                type: 'position',
            },
        ] as const);

    const useCase = getService<UpdateAirplanePathUseCase>(
        UpdateAirplanePathUseCase
    );

    const dto = {
        actorId: userId,
        strategyId: strategyId,
        airplanePathId: airplanePathId,
        startPosition: startPosition,
        endPosition: endPosition,
    };

    return await useCase.execute(dto);
}
