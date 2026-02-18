import { StrategyCommandRepositoryPort } from '@domain/strategy/port/repositories/strategy-command-repository.port';
import { UpdateMarkerPositionCommand } from '@domain/strategy/commands/marker/update-marker-position.command';
import { CreateMarkerCommand } from '@domain/strategy/commands/marker/create-marker.command';
import { DeleteMarkerCommand } from '@domain/strategy/commands/marker/delete-marker.command';
import { Marker } from '@domain/strategy/models/marker.model';

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
}
