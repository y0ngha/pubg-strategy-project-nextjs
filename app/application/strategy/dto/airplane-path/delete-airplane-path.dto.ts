import { z } from 'zod';
import { StrategyId } from '@domain/strategy/value-objects/strategy-id';
import { AirplanePathId } from '@domain/strategy/value-objects/airplane-path-id';

export interface DeleteAirplanePathRequestDto {
    strategyId: string;
    airplanePathId: string;
}

export const DeleteAirplanePathRequestSchema = z.object({
    strategyId: z.string().transform(value => {
        return StrategyId.create(value);
    }),
    airplanePathId: z.string().transform(value => {
        return AirplanePathId.create(value);
    }),
});
