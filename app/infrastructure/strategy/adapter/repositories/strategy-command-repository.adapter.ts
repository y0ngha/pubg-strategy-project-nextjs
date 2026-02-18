import { StrategyCommandRepositoryPort } from '@domain/strategy/port/repositories/strategy-command-repository.port';
import { UpdateMarkerPositionCommand } from '@domain/strategy/commands/marker/update-marker-position.command';
import { CreateMarkerCommand } from '@domain/strategy/commands/marker/create-marker.command';
import { DeleteMarkerCommand } from '@domain/strategy/commands/marker/delete-marker.command';
import { Marker } from '@domain/strategy/models/marker.model';
import { CreateAirplanePathCommand } from '@domain/strategy/commands/airplane-path/create-airplane-path.command';
import { DeleteAirplanePathCommand } from '@domain/strategy/commands/airplane-path/delete-airplane-path.command';
import { AirplanePath } from '@domain/strategy/models/airplane-path.model';
import { UpdateAirplanePathPositionCommand } from '@domain/strategy/commands/airplane-path/update-airplane-path-position.command';

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
}
