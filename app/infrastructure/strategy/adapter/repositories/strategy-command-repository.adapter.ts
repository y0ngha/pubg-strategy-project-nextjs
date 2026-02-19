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
}
