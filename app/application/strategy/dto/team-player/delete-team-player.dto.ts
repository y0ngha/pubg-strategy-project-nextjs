import { z } from 'zod';
import { StrategyId } from '@domain/strategy/value-objects/strategy-id';
import { TeamPlayerId } from '@domain/strategy/value-objects/team-player-id';

export interface DeleteTeamPlayerRequestDto {
    strategyId: string;
    teamPlayerId: string;
}

export const DeleteTeamPlayerRequestSchema = z.object({
    strategyId: z.string().transform(value => {
        return StrategyId.create(value);
    }),
    teamPlayerId: z.string().transform(value => {
        return TeamPlayerId.create(value);
    }),
});
