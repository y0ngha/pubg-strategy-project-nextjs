import { z } from 'zod';
import { UserId } from '@domain/shared/value-objects/user-id';
import { StrategyId } from '@domain/strategy/value-objects/strategy-id';
import { Position } from '@domain/strategy/value-objects/position';
import { TeamPlayerId } from '@domain/strategy/value-objects/team-player-id';

export interface UpdateWaypointRequestDto {
    actorId: string;
    strategyId: string;
    teamPlayerId: string;
    positions: { x: number; y: number }[];
}

export const UpdateWaypointRequestSchema = z.object({
    actorId: z.string().transform(value => {
        return UserId.create(value);
    }),
    strategyId: z.string().transform(value => {
        return StrategyId.create(value);
    }),
    teamPlayerId: z.string().transform(value => {
        return TeamPlayerId.create(value);
    }),
    positions: z
        .array(
            z.object({
                x: z.number(),
                y: z.number(),
            })
        )
        .transform(values => {
            return values.map(({ x, y }) => Position.create(x, y));
        }),
});
