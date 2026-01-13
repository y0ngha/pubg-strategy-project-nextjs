import { z } from 'zod';
import { UserId } from '@domain/shared/value-objects/user-id';
import { StrategyId } from '@domain/strategy/value-objects/strategy-id';
import { Position } from '@domain/strategy/value-objects/position';

export interface UpdateAirplanePathRequestDto {
    actorId: string;
    strategyId: string;
    startPosition?: { x: number; y: number };
    endPosition?: { x: number; y: number };
}

export const UpdateAirplanePathRequestSchema = z
    .object({
        actorId: z.string().transform(value => {
            return UserId.create(value);
        }),
        strategyId: z.string().transform(value => {
            return StrategyId.create(value);
        }),
        startPosition: z
            .object({
                x: z.number(),
                y: z.number(),
            })
            .transform(({ x, y }) => {
                return Position.create(x, y);
            })
            .optional(),
        endPosition: z
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
        ({ startPosition, endPosition }) => {
            return startPosition !== undefined || endPosition !== undefined;
        },
        {
            error: '업데이트 할 속성이 없습니다.',
            path: ['startPosition', 'endPosition'],
        }
    );
