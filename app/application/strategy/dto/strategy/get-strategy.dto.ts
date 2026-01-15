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

interface Position {
    x: number;
    y: number;
}

interface WaypointResponseDto {
    id: string;
    positions: Position[];
}

interface MarkerResponseDto {
    id: string;
    position: Position;
}

interface TeamPlayerResponseDto {
    id: string;
    priority: number;
    position: Position;
    color: string;
    marker?: MarkerResponseDto;
    waypoint?: WaypointResponseDto;
}

interface EnemyTeamResponseDto {
    id: string;
    teamLabel: string;
    position: Position;
}

interface CircleResponseDto {
    id: string;
    centerPosition: Position;
    phase: number;
    radius: number;
    color: string;
}

interface AirplanePathResponseDto {
    id: string;
    startPosition: Position;
    endPosition: Position;
}

interface TagResponseDto {
    id: string;
    position: Position;
    content: string;
}

interface StrategyShareResponseDto {
    id: string;
    sharedUserId: string;
    sharedEmail: string;
    permission: string;
}

interface CommentResponseDto {
    id: string;
    authorId: string;
    authorEmail: string;
    position: Position;
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
