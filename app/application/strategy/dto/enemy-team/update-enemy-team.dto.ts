import { z } from 'zod';
import { UserId } from '@domain/shared/value-objects/user-id';
import { StrategyId } from '@domain/strategy/value-objects/strategy-id';
import { TeamLabel } from '@domain/strategy/value-objects/team-label';
import { Position } from '@domain/strategy/value-objects/position';

export interface UpdateEnemyTeamRequestDto {
    actorId: string;
    strategyId: string;
    teamLabel?: string;
    position?: { x: number; y: number };
}

export const UpdateEnemyTeamRequestSchema = z
    .object({
        actorId: z.string().transform(value => {
            return UserId.create(value);
        }),
        strategyId: z.string().transform(value => {
            return StrategyId.create(value);
        }),
        teamLabel: z
            .string()
            .transform(value => {
                return TeamLabel.create(value);
            })
            .optional(),
        position: z
            .object({
                x: z.number(),
                y: z.number(),
            })
            .transform(({ x, y }) => {
                return Position.create(x, y);
            })
            .optional(),
    })
    .refine(
        ({ position, teamLabel }) => {
            return position !== undefined || teamLabel !== undefined;
        },
        {
            error: '업데이트 할 속성이 없습니다.',
            path: ['position', 'teamLabel'],
        }
    );
