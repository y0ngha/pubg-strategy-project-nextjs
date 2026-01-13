import { z } from 'zod';
import { UserId } from '@domain/shared/value-objects/user-id';
import { StrategyId } from '@domain/strategy/value-objects/strategy-id';
import { TeamLabel } from '@domain/strategy/value-objects/team-label';

export interface AddEnemyTeamRequestDto {
    actorId: string;
    strategyId: string;
    teamLabel: string;
}

export const AddEnemyTeamRequestSchema = z.object({
    actorId: z.string().transform(value => {
        return UserId.create(value);
    }),
    strategyId: z.string().transform(value => {
        return StrategyId.create(value);
    }),
    teamLabel: z.string().transform(value => {
        return TeamLabel.create(value);
    }),
});
