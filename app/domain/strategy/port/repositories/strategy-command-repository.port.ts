import { CreateMarkerCommand } from '@domain/strategy/commands/marker/create-marker.command';
import { Marker } from '@domain/strategy/models/marker.model';
import { DeleteMarkerCommand } from '@domain/strategy/commands/marker/delete-marker.command';
import { UpdateMarkerPositionCommand } from '@domain/strategy/commands/marker/update-marker-position.command';

export abstract class StrategyCommandRepositoryPort {
    abstract createMarker(command: CreateMarkerCommand): Promise<Marker>;

    abstract deleteMarker(command: DeleteMarkerCommand): Promise<void>;

    abstract updateMarkerPosition(
        command: UpdateMarkerPositionCommand
    ): Promise<void>;
}
