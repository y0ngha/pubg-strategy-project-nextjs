import { z } from 'zod';
import { UserId } from '@domain/shared/value-objects/user-id';
import { StrategyId } from '@domain/strategy/value-objects/strategy-id';
import { CircleId } from '@domain/strategy/value-objects/circle-id';
import { Position } from '@domain/strategy/value-objects/position';

export interface UpdateCircleRequestDto {
    actorId: string;
    strategyId: string;
    circleId: string;
    phase?: number;
    centerPosition?: { x: number; y: number };
}

export const UpdateCircleRequestSchema = z.object({
    actorId: z.string().transform(value => {
        return UserId.create(value);
    }),
    strategyId: z.string().transform(value => {
        return StrategyId.create(value);
    }),
    circleId: z.string().transform(value => {
        return CircleId.create(value);
    }),
    phase: z
        .number()
        .min(1, { error: '페이즈는 1이상 이어야 합니다.' })
        .max(8, { error: '페이즈는 8이하 이어야 합니다.' })
        .optional(),
    centerPosition: z
        .object({
            x: z.number(),
            y: z.number(),
        })
        .transform(({ x, y }) => {
            return Position.create(x, y);
        })
        .optional(),
});
