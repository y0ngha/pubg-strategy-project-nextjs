'use server';

import { initializeRequestServices } from '@global/di/server/get-server-dependency';
import { parseFormData } from '@/(presentation)/shared/helpers/form-data.helper';
import { Position } from '@/application/strategy/types/position';
import { ensureAuthentication } from '@/(presentation)/shared/helpers/authentication.helper';
import { CreateParentCommentUseCase } from '@/application/strategy/use-cases/comment/create-parent-comment.usecase';

export type CreateParentCommentAction = {
    id: string;
    position: Position | null;
    authorId: string;
    authorEmail: string;
    content: string;
    parentCommentId: string | null;
    createdAt: Date;
    isAuthor: boolean;
};

export async function createParentCommentAction(
    formData: FormData
): Promise<CreateParentCommentAction> {
    await ensureAuthentication();

    const getService = initializeRequestServices();

    const { strategyId, content, position } = parseFormData(formData, [
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
            key: 'position',
            error: '댓글 위치를 불러올 수 없습니다.',
            type: 'position',
        },
    ] as const);

    const useCase = getService(CreateParentCommentUseCase);

    const dto = {
        strategyId: strategyId,
        content: content,
        position: position,
    };

    return await useCase.execute(dto);
}
