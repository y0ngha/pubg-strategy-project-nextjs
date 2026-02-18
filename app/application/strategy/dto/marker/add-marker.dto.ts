import { z } from 'zod';
import { StrategyId } from '@domain/strategy/value-objects/strategy-id';
import { Position } from '@domain/strategy/value-objects/position';
import { Position as PositionInterface } from '@/application/strategy/types/position';
import { TeamPlayerId } from '@domain/strategy/value-objects/team-player-id';

export interface AddMarkerRequestDto {
    strategyId: string;
    teamPlayerId: string;
    position: PositionInterface;
}

export const AddMarkerRequestSchema = z.object({
    strategyId: z.string().transform(value => {
        return StrategyId.create(value);
    }),
    teamPlayerId: z.string().transform(value => {
        return TeamPlayerId.create(value);
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
