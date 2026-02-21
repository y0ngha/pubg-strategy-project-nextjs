import { z } from 'zod';
import { StrategyId } from '@domain/strategy/value-objects/strategy-id';
import { CirclePhase } from '@domain/strategy/value-objects/circle-phase';
import { Position as PositionInterface } from '@/application/strategy/types/position';
import { Position } from '@domain/strategy/value-objects/position';

export interface CreateCircleRequestDto {
    strategyId: string;
    phase: number;
    position: PositionInterface;
}

export const CreateCircleRequestSchema = z.object({
    strategyId: z.string().transform(value => {
        return StrategyId.create(value);
    }),
    phase: z.number().transform(value => {
        return CirclePhase.create(value);
    }),
    position: z
        .object({
            x: z.number(),
            y: z.number(),
        })
        .transform(({ x, y }) => {
            return Position.create(x, y);
        }),
});
