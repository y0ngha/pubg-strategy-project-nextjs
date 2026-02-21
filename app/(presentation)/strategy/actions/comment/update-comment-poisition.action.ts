'use server';

import { initializeRequestServices } from '@global/di/server/get-server-dependency';
import { parseFormData } from '@/(presentation)/shared/helpers/form-data.helper';
import { ensureAuthentication } from '@/(presentation)/shared/helpers/authentication.helper';
import { Position } from '@domain/strategy/models/position.model';
import { UpdateCommentPositionUseCase } from '@/application/strategy/use-cases/comment/update-comment-position.usecase';

export type UpdateCommentPositionAction = {
    id: string;
    position: Position;
};

export async function updateCommentPositionAction(
    formData: FormData
): Promise<UpdateCommentPositionAction> {
    await ensureAuthentication();

    const getService = initializeRequestServices();

    const { strategyId, commentId, position, isParent } = parseFormData(
        formData,
        [
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
                key: 'position',
                error: '댓글 위치를 불러올 수 없습니다.',
                type: 'position',
            },
            {
                key: 'isParent',
                error: '댓글의 부모 여부를 불러올 수 없습니다.',
                type: 'boolean',
            },
        ] as const
    );

    const useCase = getService(UpdateCommentPositionUseCase);

    const dto = {
        strategyId: strategyId,
        commentId: commentId,
        position: position,
        isParent: isParent,
    };

    return await useCase.execute(dto);
}
