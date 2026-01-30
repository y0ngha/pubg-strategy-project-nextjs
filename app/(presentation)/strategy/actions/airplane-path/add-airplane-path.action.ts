'use server';

import { initializeRequestServices } from '@global/di/server/get-server-dependency';
import { AddAirplanePathUseCase } from '@/application/strategy/use-cases/airplane-path/add-airplane-path.usecase';
import { parseFormData } from '@/(presentation)/shared/helpers/form-data.helper';
import { Position } from '@/application/strategy/types/position';
import { ensureAuthentication } from '@/(presentation)/shared/helpers/authentication.helper';

export type AddAirplanePathAction = {
    id: string;
    startPosition: Position;
    endPosition: Position;
};

export async function addAirplanePathAction(
    formData: FormData
): Promise<AddAirplanePathAction> {
    await ensureAuthentication();

    const getService = initializeRequestServices();

    const { userId, strategyId, startPosition, endPosition } = parseFormData(
        formData,
        [
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
                key: 'startPosition',
                error: '비행기 동선 시작 위치를 불러올 수 없습니다.',
                type: 'position',
            },
            {
                key: 'endPosition',
                error: '비행기 동선 종료 위치를 불러올 수 없습니다.',
                type: 'position',
            },
        ] as const
    );

    const dto = {
        actorId: userId,
        strategyId: strategyId,
        startPosition: startPosition,
        endPosition: endPosition,
    };

    const useCase = getService<AddAirplanePathUseCase>(AddAirplanePathUseCase);

    return await useCase.execute(dto);
}
