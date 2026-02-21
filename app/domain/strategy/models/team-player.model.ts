import { Position } from '@domain/strategy/models/position.model';
import { Marker } from '@domain/strategy/models/marker.model';
import { Waypoint } from '@domain/strategy/models/waypoint.model';

export interface TeamPlayer {
    readonly id: string;
    readonly priority: number;
    readonly position: Position;
    readonly marker: Marker | null;
    readonly waypoint: Waypoint | null;
    readonly createdAt: Date;
    readonly updatedAt: Date;
}
