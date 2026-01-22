'use server';

import { CreateTagUseCase } from '@/application/strategy/use-cases/tag/create-tag.usecase';
import { initializeRequestServices } from '@global/di/server/get-server-dependency';
import { parseFormData } from '@/(presentation)/shared/helpers/form-data.helper';

export async function createTagAction(_: unknown, formData: FormData) {
    const getService = initializeRequestServices();

    const { userId, strategyId, content } = parseFormData(formData, [
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
            key: 'content',
            error: '태그 내용을 불러올 수 없습니다.',
            type: 'string',
        },
    ] as const);

    const useCase = getService(CreateTagUseCase);

    const dto = {
        actorId: userId,
        strategyId: strategyId,
        content: content,
    };

    return await useCase.execute(dto);
}
