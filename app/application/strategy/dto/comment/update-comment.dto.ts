import { z } from 'zod';
import { UserId } from '@domain/shared/value-objects/user-id';
import { StrategyId } from '@domain/strategy/value-objects/strategy-id';
import { Position } from '@domain/strategy/value-objects/position';
import { CommentId } from '@domain/strategy/value-objects/comment-id';
import { CommentContent } from '@domain/strategy/value-objects/comment-content';

export interface UpdateCommentRequestDto {
    actorId: string;
    strategyId: string;
    commentId: string;
    content?: string;
    parentCommentId?: string;
    position?: { x: number; y: number };
}

export const UpdateCommentRequestSchema = z
    .object({
        actorId: z.string().transform(value => {
            return UserId.create(value);
        }),
        strategyId: z.string().transform(value => {
            return StrategyId.create(value);
        }),
        commentId: z.string().transform(value => {
            return CommentId.create(value);
        }),
        content: z
            .string()
            .transform(value => {
                return CommentContent.create(value);
            })
            .optional(),
        parentCommentId: z
            .string()
            .transform(value => {
                return CommentId.create(value);
            })
            .optional(),
        position: z
            .object({
                x: z.number(),
                y: z.number(),
            })
            .transform(({ x, y }) => {
                return Position.create(x, y);
            })
            .optional(),
    })
    .refine(
        ({ content, position }) => {
            return content !== undefined || position !== undefined;
        },
        {
            error: '업데이트 할 속성이 없습니다.',
            path: ['content', 'position'],
        }
    );
