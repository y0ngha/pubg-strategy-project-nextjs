'use server';

import { initializeRequestServices } from '@global/di/server/get-server-dependency';
import { parseFormData } from '@/(presentation)/shared/helpers/form-data.helper';
import { ensureAuthentication } from '@/(presentation)/shared/helpers/authentication.helper';
import { UpdateCommentContentUseCase } from '@/application/strategy/use-cases/comment/update-comment-content.usecase';

export type UpdateCommentContentAction = {
    id: string;
    content: string;
};

export async function updateCommentContentAction(
    formData: FormData
): Promise<UpdateCommentContentAction> {
    await ensureAuthentication();

    const getService = initializeRequestServices();

    const { strategyId, commentId, content } = parseFormData(formData, [
        {
            key: 'strategyId',
            error: '전략 고유 식별자를 불러올 수 없습니다.',
            type: 'string',
        },
        {
            key: 'commentId',
            error: '댓글 고유 식별자를 불러올 수 없습니다.',
            type: 'string',
        },
        {
            key: 'content',
            error: '내용을 불러올 수 없습니다.',
            type: 'string',
        },
    ] as const);

    const useCase = getService(UpdateCommentContentUseCase);

    const dto = {
        strategyId: strategyId,
        commentId: commentId,
        content: content,
    };

    return await useCase.execute(dto);
}
