import { z } from 'zod';
import { StrategyId } from '@domain/strategy/value-objects/strategy-id';
import { Position } from '@/application/strategy/types/position';

export interface GetStrategyRequestDto {
    strategyId: string;
}

export const GetStrategyRequestSchema = z.object({
    strategyId: z.string().transform(value => {
        return StrategyId.create(value);
    }),
});

export interface GetStrategiesRequestDto {
    page: number;
    limit: number;
}

export const GetStrategiesRequestSchema = z.object({
    page: z.number(),
    limit: z.number(),
});

export interface WaypointResponseDto {
    id: string;
    positions: Position[];
}

export interface MarkerResponseDto {
    id: string;
    position: Position;
}

export interface TeamPlayerResponseDto {
    id: string;
    priority: number;
    position: Position;
    color: string;
    marker?: MarkerResponseDto;
    waypoint?: WaypointResponseDto;
}

export interface EnemyTeamResponseDto {
    id: string;
    teamLabel: string;
    position: Position;
}

export interface CircleResponseDto {
    id: string;
    centerPosition: Position;
    phase: number;
    radius: number;
    color: string;
}

export interface AirplanePathResponseDto {
    id: string;
    startPosition: Position;
    endPosition: Position;
}

export interface TagResponseDto {
    id: string;
    position: Position;
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
    position: Position;
    content: string;
    createdAt: Date;
    isAuthor: boolean;
    childComments: ChildCommentResponseDto[];
}

export type ChildCommentResponseDto = Omit<
    CommentResponseDto,
    'position' | 'childComments'
>;

export interface GetStrategyResponseDto {
    id: string;
    ownerId: string;
    ownerEmail: string;
    title: string;
    map: string;
    mapName: string;
    mapImage: string;

    teamPlayers: TeamPlayerResponseDto[];
    enemyTeams: EnemyTeamResponseDto[];
    circles: CircleResponseDto[];
    airplanePath?: AirplanePathResponseDto;
    tags: TagResponseDto[];
    shares: StrategyShareResponseDto[];
    comments: CommentResponseDto[];

    createdAt: Date;
    updatedAt: Date;
}

export type GetStrategiesResponseDto = GetStrategyResponseDto[];
