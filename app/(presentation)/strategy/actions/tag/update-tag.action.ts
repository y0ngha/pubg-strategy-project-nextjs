'use server';

import { UpdateTagUseCase } from '@/application/strategy/use-cases/tag/update-tag.usecase';
import { initializeRequestServices } from '@global/di/server/get-server-dependency';
import { parseFormData } from '@/(presentation)/shared/helpers/form-data.helper';

export type UpdateTagAction = {
    id: string;
    content: string;
    position: { x: number; y: number };
};

export async function updateTagAction(formData: FormData) {
    const getService = initializeRequestServices();

    const { userId, strategyId, tagId, content, position } = parseFormData(
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
                key: 'position',
                type: 'position',
                allowUndefined: true,
            },
        ] as const
    );

    const useCase = getService(UpdateTagUseCase);

    const dto = {
        actorId: userId,
        strategyId: strategyId,
        tagId: tagId,
        content: content,
        position: position,
    };

    return await useCase.execute(dto);
}
