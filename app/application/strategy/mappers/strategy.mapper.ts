import { injectable } from 'inversify';
import { Strategy } from '@domain/strategy/entities/strategy.entity';
import {
    AirplanePathResponseDto,
    ChildCommentResponseDto,
    CircleResponseDto,
    CommentResponseDto,
    EnemyTeamResponseDto,
    GetStrategyResponseDto,
    MarkerResponseDto,
    StrategyShareResponseDto,
    TagResponseDto,
    TeamPlayerResponseDto,
    WaypointResponseDto,
} from '@/application/strategy/dto/strategy/get-strategy.dto';
import { Position as PositionInterface } from '@/application/strategy/types/position';
import { PubgMapNames } from '@domain/strategy/enums/map.enum';
import { UserId } from '@domain/shared/value-objects/user-id';
import { StrategyShareNotFoundException } from '@domain/strategy/exceptions/strategy.exceptions';
import { TeamPlayer } from '@domain/strategy/entities/team-player.entity';
import { EnemyTeam } from '@domain/strategy/entities/enemy-team.entity';
import { Circle } from '@domain/strategy/entities/circle.entity';
import { AirplanePath } from '@domain/strategy/entities/airplane-path.entity';
import { Tag } from '@domain/strategy/entities/tag.entity';
import { StrategyShare } from '@domain/strategy/entities/strategy-share.entity';
import { Position } from '@domain/strategy/value-objects/position';
import { Waypoint } from '@domain/strategy/entities/waypoint.entity';
import { Marker } from '@domain/strategy/entities/marker.entity';
import { Comment } from '@domain/strategy/entities/comment.entity';
import { CommentId } from '@domain/strategy/value-objects/comment-id';

@injectable()
export class StrategyMapper {
    toResponse(entity: Strategy, actorId: UserId): GetStrategyResponseDto {
        const permission = this.getPermission(entity, actorId);

        return {
            id: entity.id.toString(),
            ownerId: entity.ownerId.toString(),
            ownerEmail: entity.ownerEmail.toString(),
            title: entity.title.value,
            map: PubgMapNames[entity.map],

            teamPlayers: entity.teamPlayers.map(tp => this.parseTeamPlayer(tp)),
            enemyTeams: entity.enemyTeams.map(et => this.parseEnemyTeam(et)),
            circles: entity.circles.map(c => this.parseCircle(c)),
            airplanePath: entity.airplanePath
                ? this.parseAirplanePath(entity.airplanePath)
                : undefined,
            tags: entity.tags.map(tag => this.parseTag(tag)),
            shares: entity.shares.map(share => this.parseStrategyShare(share)),
            comments: this.parseParentComments(entity.comments),
            permission: permission,
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt,
        };
    }

    private parsePosition(vo: Position): PositionInterface {
        return {
            x: vo.x,
            y: vo.y,
        };
    }

    private parseMarker(entity: Marker): MarkerResponseDto {
        return {
            id: entity.id.toString(),
            position: this.parsePosition(entity.position),
        };
    }

    private parseWaypoint(entity: Waypoint): WaypointResponseDto {
        return {
            id: entity.id.toString(),
            positions: entity.positions.map(pos => this.parsePosition(pos)),
        };
    }

    private parseTeamPlayer(entity: TeamPlayer): TeamPlayerResponseDto {
        return {
            id: entity.id.toString(),
            priority: entity.priority,
            position: this.parsePosition(entity.position),
            color: entity.color,
            marker: entity.marker ? this.parseMarker(entity.marker) : undefined,
            waypoint: entity.waypoint
                ? this.parseWaypoint(entity.waypoint)
                : undefined,
        };
    }

    private parseEnemyTeam(entity: EnemyTeam): EnemyTeamResponseDto {
        return {
            id: entity.id.toString(),
            teamLabel: entity.teamLabel.toString(),
            position: this.parsePosition(entity.position),
        };
    }

    private parseCircle(entity: Circle): CircleResponseDto {
        return {
            id: entity.id.toString(),
            centerPosition: this.parsePosition(entity.centerPosition),
            phase: entity.phase.value,
            radius: entity.phase.radius,
            color: entity.phase.color,
        };
    }

    private parseAirplanePath(entity: AirplanePath): AirplanePathResponseDto {
        return {
            id: entity.id.toString(),
            startPosition: this.parsePosition(entity.startPosition),
            endPosition: this.parsePosition(entity.endPosition),
        };
    }

    private parseTag(entity: Tag): TagResponseDto {
        return {
            id: entity.id.toString(),
            content: entity.content.value,
            position: this.parsePosition(entity.position),
        };
    }

    private parseStrategyShare(
        entity: StrategyShare
    ): StrategyShareResponseDto {
        return {
            id: entity.id.toString(),
            sharedUserId: entity.sharedUserId.toString(),
            sharedEmail: entity.sharedEmail.toString(),
            permission: entity.permission.toString(),
        };
    }

    private parseComments(entities: Comment): ChildCommentResponseDto {
        return {
            id: entities.id.toString(),
            authorId: entities.authorId.toString(),
            authorEmail: entities.authorEmail.toString(),
            content: entities.content.value,
        };
    }

    private parseParentComments(entities: Comment[]): CommentResponseDto[] {
        const parentComments = entities.filter(entity => entity.isParent);

        return parentComments.map(parentComment => {
            this.ensureParentCommentPosition(
                parentComment.id,
                parentComment.position
            );

            const childComments = entities.filter(entity =>
                entity.parentCommentId?.equals(parentComment.id)
            );

            return {
                ...this.parseComments(parentComment),
                position: this.parsePosition(parentComment.position),
                childComments: childComments.map(childComment =>
                    this.parseComments(childComment)
                ),
            };
        });
    }

    private ensureParentCommentPosition(
        commentId: CommentId,
        position: Position | null
    ): asserts position is Position {
        if (position === null) {
            throw new Error(
                `댓글 파싱중 오류가 발생했습니다.\n부모 댓글에 포지션이 비어있습니다: ${commentId.toString()}`
            );
        }
    }

    private getPermission(strategy: Strategy, actorId: UserId): string {
        if (strategy.ownerId.equals(actorId)) {
            return '소유자';
        }

        const sharedStrategy = strategy.shares.find(share =>
            share.sharedUserId.equals(actorId)
        );

        if (!sharedStrategy) {
            throw new StrategyShareNotFoundException();
        }

        return sharedStrategy.isEditable ? '편집자' : '뷰어';
    }
}
