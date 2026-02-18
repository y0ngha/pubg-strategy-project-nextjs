import { CreateMarkerCommand } from '@domain/strategy/commands/marker/create-marker.command';
import { Marker } from '@domain/strategy/models/marker.model';
import { DeleteMarkerCommand } from '@domain/strategy/commands/marker/delete-marker.command';
import { UpdateMarkerPositionCommand } from '@domain/strategy/commands/marker/update-marker-position.command';
import { AirplanePath } from '@domain/strategy/models/airplane-path.model';
import { CreateAirplanePathCommand } from '@domain/strategy/commands/airplane-path/create-airplane-path.command';
import { DeleteAirplanePathCommand } from '@domain/strategy/commands/airplane-path/delete-airplane-path.command';
import { UpdateAirplanePathPositionCommand } from '@domain/strategy/commands/airplane-path/update-airplane-path-position.command';

export abstract class StrategyCommandRepositoryPort {
    abstract createMarker(command: CreateMarkerCommand): Promise<Marker>;

    abstract deleteMarker(command: DeleteMarkerCommand): Promise<void>;

    abstract updateMarkerPosition(
        command: UpdateMarkerPositionCommand
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
}
