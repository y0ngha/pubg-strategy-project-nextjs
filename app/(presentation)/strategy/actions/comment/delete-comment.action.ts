'use server';

import { initializeRequestServices } from '@global/di/server/get-server-dependency';
import { DeleteCommentUseCase } from '@/application/strategy/use-cases/comment/delete-comment.usecase';
import { parseFormData } from '@/(presentation)/shared/helpers/form-data.helper';

export async function deleteCommentAction(_: unknown, formData: FormData) {
    const getService = initializeRequestServices();

    const { userId, strategyId, commentId } = parseFormData(formData, [
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
            key: 'commentId',
            error: '댓글 고유 식별자를 불러올 수 없습니다.',
            type: 'string',
        },
    ] as const);

    const useCase = getService(DeleteCommentUseCase);

    const dto = {
        actorId: userId,
        strategyId: strategyId,
        commentId: commentId,
    };

    return await useCase.execute(dto);
}
