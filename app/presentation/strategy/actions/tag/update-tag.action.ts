'use server';

import { UpdateTagUseCase } from '@/application/strategy/use-cases/tag/update-tag.usecase';
import { initializeRequestServices } from '@global/di/server/get-server-dependency';
import { parseFormData } from '@/presentation/helpers/form-data.helper';

export async function updateTagAction(_: unknown, formData: FormData) {
    const getService = initializeRequestServices();

    const { userId, strategyId, tagId, content, positionX, positionY } =
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
                key: 'tagId',
                error: '태그 고유 식별자를 불러올 수 없습니다.',
                type: 'string',
            },
            {
                key: 'content',
                type: 'string',
                allowUndefined: true,
            },
            {
                key: 'positionX',
                type: 'number',
                allowUndefined: true,
            },
            {
                key: 'positionY',
                type: 'number',
                allowUndefined: true,
            },
        ] as const);

    const useCase = getService(UpdateTagUseCase);

    const hasPosition = positionX != null && positionY != null;

    const dto = {
        actorId: userId,
        strategyId: strategyId,
        tagId: tagId,
        content: content,
        ...(hasPosition && {
            position: {
                x: positionX,
                y: positionY,
            },
        }),
    };

    return await useCase.execute(dto);
}
