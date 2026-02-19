import { CreateMarkerCommand } from '@domain/strategy/commands/marker/create-marker.command';
import { Marker } from '@domain/strategy/models/marker.model';
import { DeleteMarkerCommand } from '@domain/strategy/commands/marker/delete-marker.command';
import { UpdateMarkerPositionCommand } from '@domain/strategy/commands/marker/update-marker-position.command';
import { UpdateEnemyTeamLabelCommand } from '@domain/strategy/commands/enemy-team/update-enemy-team-label.command';
import { UpdateEnemyTeamPositionCommand } from '@domain/strategy/commands/enemy-team/update-enemy-team-position.command';
import { DeleteEnemyTeamCommand } from '@domain/strategy/commands/enemy-team/delete-enemy-team.command';
import { CreateEnemyTeamCommand } from '@domain/strategy/commands/enemy-team/create-enemy-team.command';
import { EnemyTeam } from '@domain/strategy/models/enemy-team.model';
import { AirplanePath } from '@domain/strategy/models/airplane-path.model';
import { CreateAirplanePathCommand } from '@domain/strategy/commands/airplane-path/create-airplane-path.command';
import { DeleteAirplanePathCommand } from '@domain/strategy/commands/airplane-path/delete-airplane-path.command';
import { UpdateAirplanePathPositionCommand } from '@domain/strategy/commands/airplane-path/update-airplane-path-position.command';
import { CreateParentCommentCommand } from '@domain/strategy/commands/comment/create-parent-comment.command';
import { CreateChildCommentCommand } from '@domain/strategy/commands/comment/create-child-comment.command';
import { Comment } from '@domain/strategy/models/comment.model';
import { UpdateCommentPositionCommand } from '@domain/strategy/commands/comment/update-comment-position.command';
import { UpdateCommentContentCommand } from '@domain/strategy/commands/comment/update-comment-content.command';
import { DeleteCommentCommand } from '@domain/strategy/commands/comment/delete-comment.command';
import { DeleteCircleCommand } from '@domain/strategy/commands/circle/delete-circle.command';
import { CreateCircleCommand } from '@domain/strategy/commands/circle/create-circle.command';
import { Circle } from '@domain/strategy/models/circle.model';
import { UpdateCirclePositionCommand } from '@domain/strategy/commands/circle/update-circle-position.command';
import { UpdateCirclePhaseCommand } from '@domain/strategy/commands/circle/update-circle-phase.command';
import { CreateWaypointCommand } from '@domain/strategy/commands/waypoint/create-waypoint.command';
import { Waypoint } from '@domain/strategy/models/waypoint.model';
import { DeleteWaypointCommand } from '@domain/strategy/commands/waypoint/delete-waypoint.command';
import { UpdateWaypointPositionsCommand } from '@domain/strategy/commands/waypoint/update-waypoint-positions.command';
import { CreateTagCommand } from '@domain/strategy/commands/tag/create-tag.command';
import { Tag } from '@domain/strategy/models/tag.model';
import { DeleteTagCommand } from '@domain/strategy/commands/tag/delete-tag.command';
import { UpdateTagPositionCommand } from '@domain/strategy/commands/tag/update-tag-position.command';
import { UpdateTagContentCommand } from '@domain/strategy/commands/tag/update-tag-content.command';
import { CreateTeamPlayerCommand } from '@domain/strategy/commands/team-player/create-team-player.command';
import { TeamPlayer } from '@domain/strategy/models/team-player.model';
import { DeleteTeamPlayerCommand } from '@domain/strategy/commands/team-player/delete-team-player.command';
import { UpdateTeamPlayerPositionCommand } from '@domain/strategy/commands/team-player/update-team-player-position.command';
import { UpdateStrategySharePermissionCommand } from '@domain/strategy/commands/strategy-share/update-strategy-share-permission.command';
import { DeleteStrategyShareCommand } from '@domain/strategy/commands/strategy-share/delete-strategy-share.command';
import { CreateStrategyShareCommand } from '@domain/strategy/commands/strategy-share/create-strategy-share.command';
import { StrategyShare } from '@domain/strategy/models/strategy-share.model';

export abstract class StrategyCommandRepositoryPort {
    abstract createMarker(command: CreateMarkerCommand): Promise<Marker>;

    abstract deleteMarker(command: DeleteMarkerCommand): Promise<void>;

    abstract updateMarkerPosition(
        command: UpdateMarkerPositionCommand
    ): Promise<void>;

    abstract createEnemyTeam(
        command: CreateEnemyTeamCommand
    ): Promise<EnemyTeam>;

    abstract deleteEnemyTeam(command: DeleteEnemyTeamCommand): Promise<void>;

    abstract updateEnemyTeamPosition(
        command: UpdateEnemyTeamPositionCommand
    ): Promise<void>;

    abstract updateEnemyTeamLabel(
        command: UpdateEnemyTeamLabelCommand
    ): Promise<void>;

    abstract createAirplanePath(
        command: CreateAirplanePathCommand
    ): Promise<AirplanePath>;

    abstract deleteAirplanePath(
        command: DeleteAirplanePathCommand
    ): Promise<void>;

    abstract updateAirplanePathPosition(
        command: UpdateAirplanePathPositionCommand
    ): Promise<void>;

    abstract createParentComment(
        command: CreateParentCommentCommand
    ): Promise<Comment>;

    abstract createChildComment(
        command: CreateChildCommentCommand
    ): Promise<Comment>;

    abstract deleteComment(command: DeleteCommentCommand): Promise<void>;

    abstract updateCommentPosition(
        command: UpdateCommentPositionCommand
    ): Promise<void>;

    abstract updateCommentContent(
        command: UpdateCommentContentCommand
    ): Promise<void>;

    abstract createCircle(command: CreateCircleCommand): Promise<Circle>;

    abstract deleteCircle(command: DeleteCircleCommand): Promise<void>;

    abstract updateCirclePosition(
        command: UpdateCirclePositionCommand
    ): Promise<void>;

    abstract updateCirclePhase(
        command: UpdateCirclePhaseCommand
    ): Promise<void>;

    abstract createWaypoint(command: CreateWaypointCommand): Promise<Waypoint>;

    abstract deleteWaypoint(command: DeleteWaypointCommand): Promise<void>;

    abstract updateWaypointPositions(
        command: UpdateWaypointPositionsCommand
    ): Promise<void>;

    abstract createTag(command: CreateTagCommand): Promise<Tag>;

    abstract deleteTag(command: DeleteTagCommand): Promise<void>;

    abstract updateTagPosition(
        command: UpdateTagPositionCommand
    ): Promise<void>;

    abstract updateTagContent(command: UpdateTagContentCommand): Promise<void>;

    abstract createTeamPlayer(
        command: CreateTeamPlayerCommand
    ): Promise<TeamPlayer>;

    abstract deleteTeamPlayer(command: DeleteTeamPlayerCommand): Promise<void>;

    abstract updateTeamPlayerPosition(
        command: UpdateTeamPlayerPositionCommand
    ): Promise<void>;

    abstract createStrategyShare(
        command: CreateStrategyShareCommand
    ): Promise<StrategyShare>;

    abstract deleteStrategyShare(
        command: DeleteStrategyShareCommand
    ): Promise<void>;

    abstract updateStrategySharePermission(
        command: UpdateStrategySharePermissionCommand
    ): Promise<void>;
}
