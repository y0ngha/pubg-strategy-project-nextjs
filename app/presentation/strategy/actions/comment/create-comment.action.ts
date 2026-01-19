'use server';

import { CreateCommentUseCase } from '@/application/strategy/use-cases/comment/create-comment.usecase';
import { initializeRequestServices } from '@global/di/server/get-server-dependency';
import { parseFormData } from '@/presentation/helpers/form-data.helper';

export async function createCommentAction(_: unknown, formData: FormData) {
    const getService = initializeRequestServices();

    const {
        userId,
        userEmail,
        strategyId,
        content,
        parentCommentId,
        positionX,
        positionY,
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
        { key: 'positionX', type: 'number', allowUndefined: true },
        { key: 'positionY', type: 'number', allowUndefined: true },
    ] as const);

    const useCase = getService(CreateCommentUseCase);

    const hasPosition = positionX != null && positionY != null;

    const dto = {
        actorId: userId,
        actorEmail: userEmail,
        strategyId: strategyId,
        content: content,
        parentCommentId: parentCommentId,
        ...(hasPosition && {
            position: {
                x: positionX,
                y: positionY,
            },
        }),
    };

    return await useCase.execute(dto);
}
