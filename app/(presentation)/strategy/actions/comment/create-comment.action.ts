'use server';

import { CreateCommentUseCase } from '@/application/strategy/use-cases/comment/create-comment.usecase';
import { initializeRequestServices } from '@global/di/server/get-server-dependency';
import { parseFormData } from '@/(presentation)/shared/helpers/form-data.helper';
import { Position } from '@/application/strategy/types/position';
import { ensureAuthentication } from '@/(presentation)/shared/helpers/authentication.helper';

export type CreateCommentAction = {
    id: string;
    position: Position | null;
    authorId: string;
    authorEmail: string;
    content: string;
    parentCommentId: string | null;
};

export async function createCommentAction(
    formData: FormData
): Promise<CreateCommentAction> {
    await ensureAuthentication();

    const getService = initializeRequestServices();

    const {
        userId,
        userEmail,
        strategyId,
        content,
        parentCommentId,
        position,
    } = parseFormData(formData, [
        {
            key: 'userId',
            error: '유저 고유 식별자를 불러올 수 없습니다.',
            type: 'string',
        },
        {
            key: 'userEmail',
            error: '유저 이메일을 불러올 수 없습니다.',
            type: 'string',
        },
        {
            key: 'strategyId',
            error: '전략 고유 식별자를 불러올 수 없습니다.',
            type: 'string',
        },
        { key: 'content', error: '내용을 불러올 수 없습니다.', type: 'string' },
        { key: 'parentCommentId', type: 'string', allowUndefined: true },
        { key: 'position', type: 'position', allowUndefined: true },
    ] as const);

    const useCase = getService(CreateCommentUseCase);

    const dto = {
        actorId: userId,
        actorEmail: userEmail,
        strategyId: strategyId,
        content: content,
        parentCommentId: parentCommentId,
        position: position,
    };

    return await useCase.execute(dto);
}
