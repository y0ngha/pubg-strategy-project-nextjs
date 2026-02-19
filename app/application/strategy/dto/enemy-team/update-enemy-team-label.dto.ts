import { z } from 'zod';
import { StrategyId } from '@domain/strategy/value-objects/strategy-id';
import { EnemyTeamId } from '@domain/strategy/value-objects/enemy-team-id';
import { TeamLabel } from '@domain/strategy/value-objects/team-label';

export interface UpdateEnemyTeamLabelRequestDto {
    strategyId: string;
    enemyTeamId: string;
    teamLabel: string;
}

export const UpdateEnemyTeamLabelRequestSchema = z.object({
    strategyId: z.string().transform(value => {
        return StrategyId.create(value);
    }),
    enemyTeamId: z.string().transform(value => {
        return EnemyTeamId.create(value);
    }),
    teamLabel: z.string().transform(value => {
        return TeamLabel.create(value);
    }),
});
