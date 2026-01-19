'use server';

import { initializeRequestServices } from '@global/di/server/get-server-dependency';
import { AddAirplanePathUseCase } from '@/application/strategy/use-cases/airplane-path/add-airplane-path.usecase';
import { getRequiredFormData } from '@/presentation/helpers/form-data.helper';

export async function addAirplanePathAction(_: unknown, formData: FormData) {
    const getService = initializeRequestServices();

    const {
        userId,
        strategyId,
        startPositionX,
        startPositionY,
        endPositionX,
        endPositionY,
    } = getRequiredFormData(formData, [
        { key: 'userId', error: '유저 고유 식별자를 불러올 수 없습니다.' },
        {
            key: 'strategyId',
            error: '전략 고유 식별자를 불러올 수 없습니다.',
        },
        {
            key: 'startPositionX',
            error: '비행기 동선 시작 위치를 불러올 수 없습니다.',
        },
        {
            key: 'startPositionY',
            error: '비행기 동선 시작 위치를 불러올 수 없습니다.',
        },
        {
            key: 'endPositionX',
            error: '비행기 동선 종료 위치를 불러올 수 없습니다.',
        },
        {
            key: 'endPositionY',
            error: '비행기 동선 종료 위치를 불러올 수 없습니다.',
        },
    ]);

    const dto = {
        actorId: userId,
        strategyId: strategyId,
        startPosition: {
            x: Number(startPositionX),
            y: Number(startPositionY),
        },
        endPosition: {
            x: Number(endPositionX),
            y: Number(endPositionY),
        },
    };

    const useCase = getService<AddAirplanePathUseCase>(AddAirplanePathUseCase);

    return await useCase.execute(dto);
}
