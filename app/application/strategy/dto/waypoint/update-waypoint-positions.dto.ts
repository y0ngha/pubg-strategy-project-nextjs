import { z } from 'zod';
import { StrategyId } from '@domain/strategy/value-objects/strategy-id';
import { Position } from '@domain/strategy/value-objects/position';
import { TeamPlayerId } from '@domain/strategy/value-objects/team-player-id';
import { Position as PositionInterface } from '@/application/strategy/types/position';
import { WaypointId } from '@domain/strategy/value-objects/waypoint-id';

export interface UpdateWaypointPositionsRequestDto {
    strategyId: string;
    teamPlayerId: string;
    waypointId: string;
    positions: PositionInterface[];
}

export const UpdateWaypointPositionsRequestSchema = z.object({
    strategyId: z.string().transform(value => {
        return StrategyId.create(value);
    }),
    teamPlayerId: z.string().transform(value => {
        return TeamPlayerId.create(value);
    }),
    waypointId: z.string().transform(value => {
        return WaypointId.create(value);
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
