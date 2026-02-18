import { z } from 'zod';
import { StrategyId } from '@domain/strategy/value-objects/strategy-id';
import { TeamPlayerId } from '@domain/strategy/value-objects/team-player-id';
import { MarkerId } from '@domain/strategy/value-objects/marker-id';

export interface DeleteMarkerRequestDto {
    strategyId: string;
    teamPlayerId: string;
    markerId: string;
}

export const DeleteMarkerRequestSchema = z.object({
    strategyId: z.string().transform(value => {
        return StrategyId.create(value);
    }),
    teamPlayerId: z.string().transform(value => {
        return TeamPlayerId.create(value);
    }),
    markerId: z.string().transform(value => {
        return MarkerId.create(value);
    }),
});
