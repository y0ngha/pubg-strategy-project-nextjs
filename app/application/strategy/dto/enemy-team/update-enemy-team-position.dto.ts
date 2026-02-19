import { z } from 'zod';
import { StrategyId } from '@domain/strategy/value-objects/strategy-id';
import { Position } from '@domain/strategy/value-objects/position';
import { EnemyTeamId } from '@domain/strategy/value-objects/enemy-team-id';
import { Position as PositionInterface } from '@/application/strategy/types/position';

export interface UpdateEnemyTeamPositionRequestDto {
    strategyId: string;
    enemyTeamId: string;
    position: PositionInterface;
}

export const UpdateEnemyTeamPositionRequestSchema = z.object({
    strategyId: z.string().transform(value => {
        return StrategyId.create(value);
    }),
    enemyTeamId: z.string().transform(value => {
        return EnemyTeamId.create(value);
    }),
    position: z
        .object({
            x: z.number(),
            y: z.number(),
        })
        .transform(({ x, y }) => {
            return Position.create(x, y);
        }),
});
