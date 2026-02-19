import { injectable } from 'inversify';
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
import { PubgMap, PubgMapNames } from '@domain/strategy/enums/map.enum';
import { Position } from '@/domain/strategy/models/position.model';
import { Marker } from '@domain/strategy/models/marker.model';
import { Waypoint } from '@domain/strategy/models/waypoint.model';
import { TeamPlayer } from '@domain/strategy/models/team-player.model';
import { EnemyTeam } from '@domain/strategy/models/enemy-team.model';
import { Circle } from '@domain/strategy/models/circle.model';
import { AirplanePath } from '@domain/strategy/models/airplane-path.model';
import { Tag } from '@domain/strategy/models/tag.model';
import { StrategyShare } from '@domain/strategy/models/strategy-share.model';
import { Strategy } from '@domain/strategy/models/strategy.model';
import { Comment } from '@domain/strategy/models/comment.model';
import {
    CIRCLE_COLOR_MAP,
    CIRCLE_RADIUS_MAP,
} from '@domain/strategy/constants/circle-phase.constants';
import { TEAM_PLAYER_COLOR_MAP } from '@domain/strategy/constants/team-player.constants';

@injectable()
export class StrategyMapper {
    private readonly mapImages = {
        [PubgMap.ERANGEL]: '/images/maps/Erangel.webp',
        [PubgMap.MIRAMAR]: '/images/maps/Miramar.webp',
        [PubgMap.TAEGO]: '/images/maps/Taego.webp',
        [PubgMap.RONDO]: '/images/maps/Rondo.webp',
        [PubgMap.SANHOK]: '/images/maps/Sanhok.webp',
        [PubgMap.VIKENDI]: '/images/maps/Vikendi.webp',
        [PubgMap.KARAKIN]: '/images/maps/Karakin.webp',
        [PubgMap.HAVEN]: '/images/maps/Haven.webp',
        [PubgMap.DESTON]: '/images/maps/Deston.webp',
    };

    toResponse(model: Strategy): GetStrategyResponseDto {
        return {
            id: model.id,
            ownerId: model.ownerId,
            ownerEmail: model.ownerEmail,
            title: model.title,
            map: model.map,
            mapName: PubgMapNames[model.map],
            mapImage: this.mapImages[model.map],
            teamPlayers: model.teamPlayers.map(tp => this.parseTeamPlayer(tp)),
            enemyTeams: model.enemyTeams.map(et => this.parseEnemyTeam(et)),
            circles: model.circles.map(c => this.parseCircle(c)),
            airplanePath: model.airplanePath
                ? this.parseAirplanePath(model.airplanePath)
                : undefined,
            tags: model.tags.map(tag => this.parseTag(tag)),
            shares: model.shares.map(share => this.parseStrategyShare(share)),
            comments: this.parseParentComments(model.comments),
            createdAt: model.createdAt,
            updatedAt: model.updatedAt,
        };
    }

    private parsePosition(vo: Position): PositionInterface {
        return {
            x: vo.x,
            y: vo.y,
        };
    }

    private parseMarker(model: Marker): MarkerResponseDto {
        return {
            id: model.id,
            position: this.parsePosition(model.position),
        };
    }

    private parseWaypoint(model: Waypoint): WaypointResponseDto {
        return {
            id: model.id,
            positions: model.positions.map(pos => this.parsePosition(pos)),
        };
    }

    private parseTeamPlayer(model: TeamPlayer): TeamPlayerResponseDto {
        return {
            id: model.id,
            priority: model.priority,
            position: this.parsePosition(model.position),
            color: TEAM_PLAYER_COLOR_MAP[model.priority],
            marker: model.marker ? this.parseMarker(model.marker) : undefined,
            waypoint: model.waypoint
                ? this.parseWaypoint(model.waypoint)
                : undefined,
        };
    }

    private parseEnemyTeam(model: EnemyTeam): EnemyTeamResponseDto {
        return {
            id: model.id,
            teamLabel: model.teamLabel,
            position: this.parsePosition(model.position),
        };
    }

    private parseCircle(model: Circle): CircleResponseDto {
        return {
            id: model.id,
            centerPosition: this.parsePosition(model.centerPosition),
            phase: model.phase,
            radius: CIRCLE_RADIUS_MAP[model.phase],
            color: CIRCLE_COLOR_MAP[model.phase],
        };
    }

    private parseAirplanePath(model: AirplanePath): AirplanePathResponseDto {
        return {
            id: model.id,
            startPosition: this.parsePosition(model.startPosition),
            endPosition: this.parsePosition(model.endPosition),
        };
    }

    private parseTag(model: Tag): TagResponseDto {
        return {
            id: model.id,
            content: model.content,
            position: this.parsePosition(model.position),
        };
    }

    private parseStrategyShare(model: StrategyShare): StrategyShareResponseDto {
        return {
            id: model.id,
            sharedUserId: model.sharedUserId,
            sharedEmail: model.sharedEmail,
            permission: model.permission,
        };
    }

    private parseComments(entities: Comment): ChildCommentResponseDto {
        return {
            id: entities.id,
            authorId: entities.authorId,
            authorEmail: entities.authorEmail,
            content: entities.content,
            createdAt: entities.createdAt,
            isAuthor: entities.isAuthor,
        };
    }

    private parseParentComments(entities: Comment[]): CommentResponseDto[] {
        const parentComments = entities.filter(model => model.isParent);

        return parentComments.map(parentComment => {
            this.ensureParentCommentPosition(
                parentComment.id,
                parentComment.position
            );

            const childComments = entities.filter(
                model => model.parentCommentId === parentComment.id
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
        commentId: string,
        position: Position | null
    ): asserts position is Position {
        if (position === null) {
            throw new Error(
                `댓글 파싱중 오류가 발생했습니다.\n부모 댓글에 포지션이 비어있습니다: ${commentId}`
            );
        }
    }
}
