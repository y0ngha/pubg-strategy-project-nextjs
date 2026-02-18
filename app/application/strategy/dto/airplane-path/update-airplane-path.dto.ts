import { z } from 'zod';
import { StrategyId } from '@domain/strategy/value-objects/strategy-id';
import { Position } from '@domain/strategy/value-objects/position';
import { Position as PositionInterface } from '@/application/strategy/types/position';
import { AirplanePathId } from '@domain/strategy/value-objects/airplane-path-id';

export interface UpdateAirplanePathRequestDto {
    strategyId: string;
    airplanePathId: string;
    startPosition: PositionInterface;
    endPosition: PositionInterface;
}

export const UpdateAirplanePathRequestSchema = z.object({
    strategyId: z.string().transform(value => {
        return StrategyId.create(value);
    }),
    airplanePathId: z.string().transform(value => {
        return AirplanePathId.create(value);
    }),
    startPosition: z
        .object({
            x: z.number(),
            y: z.number(),
        })
        .transform(({ x, y }) => {
            return Position.create(x, y);
        }),
    endPosition: z
        .object({
            x: z.number(),
            y: z.number(),
        })
        .transform(({ x, y }) => {
            return Position.create(x, y);
        }),
});
