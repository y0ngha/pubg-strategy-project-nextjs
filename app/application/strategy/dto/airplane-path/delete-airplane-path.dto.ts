import { z } from 'zod';
import { UserId } from '@domain/shared/value-objects/user-id';
import { StrategyId } from '@domain/strategy/value-objects/strategy-id';
import { AirplanePathId } from '@domain/strategy/value-objects/airplane-path-id';

export interface DeleteAirplanePathRequestDto {
    actorId: string;
    strategyId: string;
    airplanePathId: string;
}

export const DeleteAirplanePathRequestSchema = z.object({
    actorId: z.string().transform(value => {
        return UserId.create(value);
    }),
    strategyId: z.string().transform(value => {
        return StrategyId.create(value);
    }),
    airplanePathId: z.string().transform(value => {
        return AirplanePathId.create(value);
    }),
});
