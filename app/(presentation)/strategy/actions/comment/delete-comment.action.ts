'use server';

import { initializeRequestServices } from '@global/di/server/get-server-dependency';
import { DeleteCommentUseCase } from '@/application/strategy/use-cases/comment/delete-comment.usecase';
import { parseFormData } from '@/(presentation)/shared/helpers/form-data.helper';

export type DeleteCommentAction = { commentId: string };

export async function deleteCommentAction(
    formData: FormData
): Promise<DeleteCommentAction> {
    const getService = initializeRequestServices();

    const { strategyId, commentId } = parseFormData(formData, [
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
    ] as const);

    const useCase = getService(DeleteCommentUseCase);

    const dto = {
        strategyId: strategyId,
        commentId: commentId,
    };

    return await useCase.execute(dto);
}
