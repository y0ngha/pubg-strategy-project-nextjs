import { CreateMarkerCommand } from '@domain/strategy/commands/marker/create-marker.command';
import { Marker } from '@domain/strategy/models/marker.model';
import { DeleteMarkerCommand } from '@domain/strategy/commands/marker/delete-marker.command';
import { UpdateMarkerPositionCommand } from '@domain/strategy/commands/marker/update-marker-position.command';
import { UpdateEnemyTeamLabelCommand } from '@domain/strategy/commands/enemy-team/update-enemy-team-label.command';
import { UpdateEnemyTeamPositionCommand } from '@domain/strategy/commands/enemy-team/update-enemy-team-position.command';
import { DeleteEnemyTeamCommand } from '@domain/strategy/commands/enemy-team/delete-enemy-team.command';
import { CreateEnemyTeamCommand } from '@domain/strategy/commands/enemy-team/create-enemy-team.command';
import { EnemyTeam } from '@domain/strategy/models/enemy-team.model';

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
}
