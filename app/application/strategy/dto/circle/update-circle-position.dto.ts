import { z } from 'zod';
import { StrategyId } from '@domain/strategy/value-objects/strategy-id';
import { CircleId } from '@domain/strategy/value-objects/circle-id';
import { Position } from '@domain/strategy/value-objects/position';
import { Position as PositionInterface } from '@/application/strategy/types/position';

export interface UpdateCirclePositionRequestDto {
    strategyId: string;
    circleId: string;
    centerPosition: PositionInterface;
}

export const UpdateCirclePositionRequestSchema = z.object({
    strategyId: z.string().transform(value => {
        return StrategyId.create(value);
    }),
    circleId: z.string().transform(value => {
        return CircleId.create(value);
    }),
    centerPosition: z
        .object({
            x: z.number(),
            y: z.number(),
        })
        .transform(({ x, y }) => {
            return Position.create(x, y);
        }),
});
