import { z } from 'zod';
import { StrategyId } from '@domain/strategy/value-objects/strategy-id';
import { TeamLabel } from '@domain/strategy/value-objects/team-label';
import { Position as PositionInterface } from '@/application/strategy/types/position';
import { Position } from '@domain/strategy/value-objects/position';

export interface AddEnemyTeamRequestDto {
    strategyId: string;
    teamLabel: string;
    position: PositionInterface;
}

export const AddEnemyTeamRequestSchema = z.object({
    strategyId: z.string().transform(value => {
        return StrategyId.create(value);
    }),
    teamLabel: z.string().transform(value => {
        return TeamLabel.create(value);
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
