import { z } from 'zod';
import { StrategyId } from '@domain/strategy/value-objects/strategy-id';
import { CircleId } from '@domain/strategy/value-objects/circle-id';
import { CirclePhase } from '@domain/strategy/value-objects/circle-phase';

export interface UpdateCirclePhaseRequestDto {
    strategyId: string;
    circleId: string;
    phase: number;
}

export const UpdateCirclePhaseRequestSchema = z.object({
    strategyId: z.string().transform(value => {
        return StrategyId.create(value);
    }),
    circleId: z.string().transform(value => {
        return CircleId.create(value);
    }),
    phase: z.number().transform(value => {
        return CirclePhase.create(value);
    }),
});
