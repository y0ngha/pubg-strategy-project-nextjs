import { z } from 'zod';
import { UserId } from '@domain/shared/value-objects/user-id';
import { StrategyId } from '@domain/strategy/value-objects/strategy-id';
import { TagId } from '@domain/strategy/value-objects/tag-id';
import { CommentContent } from '@domain/strategy/value-objects/comment-content';
import { Position } from '@domain/strategy/value-objects/position';

export interface UpdateTagRequestDto {
    actorId: string;
    strategyId: string;
    tagId: string;
    content?: string;
    position?: { x: number; y: number };
}

export const UpdateTagRequestSchema = z
    .object({
        actorId: z.string().transform(value => {
            return UserId.create(value);
        }),
        strategyId: z.string().transform(value => {
            return StrategyId.create(value);
        }),
        tagId: z.string().transform(value => {
            return TagId.create(value);
        }),
        content: z
            .string()
            .transform(value => {
                return CommentContent.create(value);
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
