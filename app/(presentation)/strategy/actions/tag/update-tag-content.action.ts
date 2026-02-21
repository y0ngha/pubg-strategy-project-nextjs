'use server';

import { initializeRequestServices } from '@global/di/server/get-server-dependency';
import { parseFormData } from '@/(presentation)/shared/helpers/form-data.helper';
import { UpdateTagContentUseCase } from '@/application/strategy/use-cases/tag/update-tag-content.usecase';

export type UpdateTagContentAction = {
    id: string;
    content: string;
};

export async function updateTagContentAction(
    formData: FormData
): Promise<UpdateTagContentAction> {
    const getService = initializeRequestServices();

    const { strategyId, tagId, content } = parseFormData(formData, [
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
            error: '태그 내용을 불러올 수 없습니다.',
            type: 'string',
        },
    ] as const);

    const useCase = getService(UpdateTagContentUseCase);

    const dto = {
        strategyId: strategyId,
        tagId: tagId,
        content: content,
    };

    return await useCase.execute(dto);
}
