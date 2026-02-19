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
}
