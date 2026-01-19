'use server';

import { UpdateCommentUseCase } from '@/application/strategy/use-cases/comment/update-comment.usecase';
import { initializeRequestServices } from '@global/di/server/get-server-dependency';
import { parseFormData } from '@/presentation/helpers/form-data.helper';

export async function updateCommentAction(_: unknown, formData: FormData) {
    const getService = initializeRequestServices();

    const { userId, strategyId, commentId, content, position } = parseFormData(
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
                key: 'commentId',
                error: '댓글 고유 식별자를 불러올 수 없습니다.',
                type: 'string',
            },
            { key: 'content', type: 'string', allowUndefined: true },
            { key: 'position', type: 'position', allowUndefined: true },
        ] as const
    );

    const useCase = getService(UpdateCommentUseCase);

    const dto = {
        actorId: userId,
        strategyId: strategyId,
        commentId: commentId,
        content: content,
        position: position,
    };

    return await useCase.execute(dto);
}
