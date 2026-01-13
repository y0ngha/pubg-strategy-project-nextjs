import { z } from 'zod';
import { UserId } from '@domain/shared/value-objects/user-id';
import { StrategyId } from '@domain/strategy/value-objects/strategy-id';
import { EnemyTeamId } from '@domain/strategy/value-objects/enemy-team-id';

export interface DeleteEnemyTeamRequestDto {
    actorId: string;
    strategyId: string;
    enemyTeamId: string;
}

export const DeleteEnemyTeamRequestSchema = z.object({
    actorId: z.string().transform(value => {
        return UserId.create(value);
    }),
    strategyId: z.string().transform(value => {
        return StrategyId.create(value);
    }),
    enemyTeamId: z.string().transform(value => {
        return EnemyTeamId.create(value);
    }),
});
