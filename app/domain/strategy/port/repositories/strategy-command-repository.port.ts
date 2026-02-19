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
import { DeleteCircleCommand } from '@domain/strategy/commands/circle/delete-circle.command';
import { CreateCircleCommand } from '@domain/strategy/commands/circle/create-circle.command';
import { Circle } from '@domain/strategy/models/circle.model';
import { UpdateCirclePositionCommand } from '@domain/strategy/commands/circle/update-circle-position.command';
import { UpdateCirclePhaseCommand } from '@domain/strategy/commands/circle/update-circle-phase.command';

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

    abstract createCircle(command: CreateCircleCommand): Promise<Circle>;

    abstract deleteCircle(command: DeleteCircleCommand): Promise<void>;

    abstract updateCirclePosition(
        command: UpdateCirclePositionCommand
    ): Promise<void>;

    abstract updateCirclePhase(
        command: UpdateCirclePhaseCommand
    ): Promise<void>;
}
