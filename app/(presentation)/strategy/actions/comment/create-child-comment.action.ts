'use server';

import { initializeRequestServices } from '@global/di/server/get-server-dependency';
import { parseFormData } from '@/(presentation)/shared/helpers/form-data.helper';
import { Position } from '@/application/strategy/types/position';
import { ensureAuthentication } from '@/(presentation)/shared/helpers/authentication.helper';
import { CreateChildCommentUseCase } from '@/application/strategy/use-cases/comment/create-child-comment.usecase';

export type CreateChildCommentAction = {
    id: string;
    position: Position | null;
    authorId: string;
    authorEmail: string;
    content: string;
    parentCommentId: string | null;
    createdAt: Date;
    isAuthor: boolean;
};

export async function createChildCommentAction(
    formData: FormData
): Promise<CreateChildCommentAction> {
    await ensureAuthentication();

    const getService = initializeRequestServices();

    const { strategyId, content, parentCommentId } = parseFormData(formData, [
        {
            key: 'strategyId',
            error: '전략 고유 식별자를 불러올 수 없습니다.',
            type: 'string',
        },
        {
            key: 'content',
            error: '내용을 불러올 수 없습니다.',
            type: 'string',
        },
        {
            key: 'parentCommentId',
            error: '부모 댓글 고유 식별자를 불러올 수 없습니다.',
            type: 'string',
        },
    ] as const);

    const useCase = getService(CreateChildCommentUseCase);

    const dto = {
        strategyId: strategyId,
        content: content,
        parentCommentId: parentCommentId,
    };

    return await useCase.execute(dto);
}
