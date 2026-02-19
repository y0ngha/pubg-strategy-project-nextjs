import { StrategyCommandRepositoryPort } from '@domain/strategy/port/repositories/strategy-command-repository.port';
import { UpdateMarkerPositionCommand } from '@domain/strategy/commands/marker/update-marker-position.command';
import { CreateMarkerCommand } from '@domain/strategy/commands/marker/create-marker.command';
import { DeleteMarkerCommand } from '@domain/strategy/commands/marker/delete-marker.command';
import { Marker } from '@domain/strategy/models/marker.model';
import { CreateEnemyTeamCommand } from '@domain/strategy/commands/enemy-team/create-enemy-team.command';
import { DeleteEnemyTeamCommand } from '@domain/strategy/commands/enemy-team/delete-enemy-team.command';
import { EnemyTeam } from '@domain/strategy/models/enemy-team.model';
import { UpdateEnemyTeamPositionCommand } from '@domain/strategy/commands/enemy-team/update-enemy-team-position.command';
import { UpdateEnemyTeamLabelCommand } from '@domain/strategy/commands/enemy-team/update-enemy-team-label.command';
import { CreateAirplanePathCommand } from '@domain/strategy/commands/airplane-path/create-airplane-path.command';
import { DeleteAirplanePathCommand } from '@domain/strategy/commands/airplane-path/delete-airplane-path.command';
import { AirplanePath } from '@domain/strategy/models/airplane-path.model';
import { UpdateAirplanePathPositionCommand } from '@domain/strategy/commands/airplane-path/update-airplane-path-position.command';
import { CreateChildCommentCommand } from '@domain/strategy/commands/comment/create-child-comment.command';
import { CreateParentCommentCommand } from '@domain/strategy/commands/comment/create-parent-comment.command';
import { UpdateCommentContentCommand } from '@domain/strategy/commands/comment/update-comment-content.command';
import { UpdateCommentPositionCommand } from '@domain/strategy/commands/comment/update-comment-position.command';
import { Comment } from '@domain/strategy/models/comment.model';
import { DeleteCommentCommand } from '@domain/strategy/commands/comment/delete-comment.command';
import { UpdateCirclePositionCommand } from '@domain/strategy/commands/circle/update-circle-position.command';
import { CreateCircleCommand } from '@domain/strategy/commands/circle/create-circle.command';
import { Circle } from '@domain/strategy/models/circle.model';
import { DeleteCircleCommand } from '@domain/strategy/commands/circle/delete-circle.command';
import { UpdateCirclePhaseCommand } from '@domain/strategy/commands/circle/update-circle-phase.command';
import { Waypoint } from '@domain/strategy/models/waypoint.model';
import { CreateWaypointCommand } from '@domain/strategy/commands/waypoint/create-waypoint.command';
import { DeleteWaypointCommand } from '@domain/strategy/commands/waypoint/delete-waypoint.command';
import { UpdateWaypointPositionsCommand } from '@domain/strategy/commands/waypoint/update-waypoint-positions.command';
import { UpdateTagPositionCommand } from '@domain/strategy/commands/tag/update-tag-position.command';
import { CreateTagCommand } from '@domain/strategy/commands/tag/create-tag.command';
import { Tag } from '@domain/strategy/models/tag.model';
import { DeleteTagCommand } from '@domain/strategy/commands/tag/delete-tag.command';
import { UpdateTagContentCommand } from '@domain/strategy/commands/tag/update-tag-content.command';
import { CreateTeamPlayerCommand } from '@domain/strategy/commands/team-player/create-team-player.command';
import { TeamPlayer } from '@domain/strategy/models/team-player.model';
import { DeleteTeamPlayerCommand } from '@domain/strategy/commands/team-player/delete-team-player.command';
import { UpdateTeamPlayerPositionCommand } from '@domain/strategy/commands/team-player/update-team-player-position.command';
import { DeleteStrategyShareCommand } from '@domain/strategy/commands/strategy-share/delete-strategy-share.command';
import { CreateStrategyShareCommand } from '@domain/strategy/commands/strategy-share/create-strategy-share.command';
import { StrategyShare } from '@domain/strategy/models/strategy-share.model';
import { UpdateStrategySharePermissionCommand } from '@domain/strategy/commands/strategy-share/update-strategy-share-permission.command';

export class StrategyCommandRepositoryAdapter extends StrategyCommandRepositoryPort {
    createMarker(command: CreateMarkerCommand): Promise<Marker> {
        throw new Error('Not Implemented.');
    }

    deleteMarker(command: DeleteMarkerCommand): Promise<void> {
        throw new Error('Not Implemented.');
    }

    updateMarkerPosition(command: UpdateMarkerPositionCommand): Promise<void> {
        throw new Error('Not Implemented.');
    }

    createEnemyTeam(command: CreateEnemyTeamCommand): Promise<EnemyTeam> {
        throw new Error('Not Implemented.');
    }

    deleteEnemyTeam(command: DeleteEnemyTeamCommand): Promise<void> {
        throw new Error('Not Implemented.');
    }

    updateEnemyTeamPosition(
        command: UpdateEnemyTeamPositionCommand
    ): Promise<void> {
        throw new Error('Not Implemented.');
    }

    updateEnemyTeamLabel(command: UpdateEnemyTeamLabelCommand): Promise<void> {
        throw new Error('Not Implemented.');
    }

    createAirplanePath(
        command: CreateAirplanePathCommand
    ): Promise<AirplanePath> {
        throw new Error('Not Implemented.');
    }

    deleteAirplanePath(command: DeleteAirplanePathCommand): Promise<void> {
        throw new Error('Not Implemented.');
    }

    updateAirplanePathPosition(
        command: UpdateAirplanePathPositionCommand
    ): Promise<void> {
        throw new Error('Not Implemented.');
    }

    createCircle(command: CreateCircleCommand): Promise<Circle> {
        throw new Error('Not Implemented.');
    }

    deleteCircle(command: DeleteCircleCommand): Promise<void> {
        throw new Error('Not Implemented.');
    }

    updateCirclePhase(command: UpdateCirclePhaseCommand): Promise<void> {
        throw new Error('Not Implemented.');
    }

    updateCirclePosition(command: UpdateCirclePositionCommand): Promise<void> {
        throw new Error('Not Implemented.');
    }

    createChildComment(command: CreateChildCommentCommand): Promise<Comment> {
        throw new Error('Not Implemented.');
    }

    createParentComment(command: CreateParentCommentCommand): Promise<Comment> {
        throw new Error('Not Implemented.');
    }

    deleteComment(command: DeleteCommentCommand): Promise<void> {
        throw new Error('Not Implemented.');
    }

    updateCommentContent(command: UpdateCommentContentCommand): Promise<void> {
        throw new Error('Not Implemented.');
    }

    updateCommentPosition(
        command: UpdateCommentPositionCommand
    ): Promise<void> {
        throw new Error('Not Implemented.');
    }

    createWaypoint(command: CreateWaypointCommand): Promise<Waypoint> {
        throw new Error('Not Implemented.');
    }

    deleteWaypoint(command: DeleteWaypointCommand): Promise<void> {
        throw new Error('Not Implemented.');
    }

    updateWaypointPositions(
        command: UpdateWaypointPositionsCommand
    ): Promise<void> {
        throw new Error('Not Implemented.');
    }

    createTag(command: CreateTagCommand): Promise<Tag> {
        throw new Error('Not Implemented.');
    }

    deleteTag(command: DeleteTagCommand): Promise<void> {
        throw new Error('Not Implemented.');
    }

    updateTagContent(command: UpdateTagContentCommand): Promise<void> {
        throw new Error('Not Implemented.');
    }

    updateTagPosition(command: UpdateTagPositionCommand): Promise<void> {
        throw new Error('Not Implemented.');
    }

    createTeamPlayer(command: CreateTeamPlayerCommand): Promise<TeamPlayer> {
        throw new Error('Not Implemented.');
    }

    deleteTeamPlayer(command: DeleteTeamPlayerCommand): Promise<void> {
        throw new Error('Not Implemented.');
    }

    updateTeamPlayerPosition(
        command: UpdateTeamPlayerPositionCommand
    ): Promise<void> {
        throw new Error('Not Implemented.');
    }

    createStrategyShare(
        command: CreateStrategyShareCommand
    ): Promise<StrategyShare> {
        throw new Error('Not Implemented.');
    }

    deleteStrategyShare(command: DeleteStrategyShareCommand): Promise<void> {
        throw new Error('Not Implemented.');
    }

    updateStrategySharePermission(
        command: UpdateStrategySharePermissionCommand
    ): Promise<void> {
        throw new Error('Not Implemented.');
    }
}
