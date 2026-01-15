import { z } from 'zod';
import { UserId } from '@domain/shared/value-objects/user-id';
import { StrategyId } from '@domain/strategy/value-objects/strategy-id';

export interface GetStrategyRequestDto {
    actorId: string;
    strategyId: string;
}

export const GetStrategyRequestSchema = z.object({
    actorId: z.string().transform(value => {
        return UserId.create(value);
    }),
    strategyId: z.string().transform(value => {
        return StrategyId.create(value);
    }),
});

export interface GetStrategiesRequestDto {
    actorId: string;
}

export const GetStrategiesRequestSchema = z.object({
    actorId: z.string().transform(value => {
        return UserId.create(value);
    }),
});

export interface PositionResponseDto {
    x: number;
    y: number;
}

export interface WaypointResponseDto {
    id: string;
    positions: PositionResponseDto[];
}

export interface MarkerResponseDto {
    id: string;
    position: PositionResponseDto;
}

export interface TeamPlayerResponseDto {
    id: string;
    priority: number;
    position: PositionResponseDto;
    color: string;
    marker?: MarkerResponseDto;
    waypoint?: WaypointResponseDto;
}

export interface EnemyTeamResponseDto {
    id: string;
    teamLabel: string;
    position: PositionResponseDto;
}

export interface CircleResponseDto {
    id: string;
    centerPosition: PositionResponseDto;
    phase: number;
    radius: number;
    color: string;
}

export interface AirplanePathResponseDto {
    id: string;
    startPosition: PositionResponseDto;
    endPosition: PositionResponseDto;
}

export interface TagResponseDto {
    id: string;
    position: PositionResponseDto;
    content: string;
}

export interface StrategyShareResponseDto {
    id: string;
    sharedUserId: string;
    sharedEmail: string;
    permission: string;
}

export interface CommentResponseDto {
    id: string;
    authorId: string;
    authorEmail: string;
    position: PositionResponseDto;
    content: string;
    childComments: Omit<CommentResponseDto, 'position'>;
}

export interface GetStrategyResponseDto {
    id: string;
    ownerId: string;
    title: string;
    map: string;

    teamPlayers: TeamPlayerResponseDto[];
    enemyTeams: EnemyTeamResponseDto[];
    circles: CircleResponseDto[];
    airplanePath?: AirplanePathResponseDto;
    tags: TagResponseDto[];
    shares: StrategyShareResponseDto[];
    comments: CommentResponseDto[];

    permission: string;

    createdAt: Date;
    updatedAt: Date;
}

export type GetStrategiesResponseDto = GetStrategyResponseDto[];
