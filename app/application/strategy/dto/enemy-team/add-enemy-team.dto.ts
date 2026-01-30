import { z } from 'zod';
import { UserId } from '@domain/shared/value-objects/user-id';
import { StrategyId } from '@domain/strategy/value-objects/strategy-id';
import { TeamLabel } from '@domain/strategy/value-objects/team-label';
import { Position as PositionInterface } from '@/application/strategy/types/position';
import { Position } from '@domain/strategy/value-objects/position';

export interface AddEnemyTeamRequestDto {
    actorId: string;
    strategyId: string;
    teamLabel: string;
    position: PositionInterface;
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
    position: z
        .object({
            x: z.number(),
            y: z.number(),
        })
        .transform(({ x, y }) => {
            return Position.create(x, y);
        }),
});
