import { z } from 'zod';
import { StrategyId } from '@domain/strategy/value-objects/strategy-id';
import { EnemyTeamId } from '@domain/strategy/value-objects/enemy-team-id';

export interface DeleteEnemyTeamRequestDto {
    strategyId: string;
    enemyTeamId: string;
}

export const DeleteEnemyTeamRequestSchema = z.object({
    strategyId: z.string().transform(value => {
        return StrategyId.create(value);
    }),
    enemyTeamId: z.string().transform(value => {
        return EnemyTeamId.create(value);
    }),
});
