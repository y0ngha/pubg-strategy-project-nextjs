import { Position } from '@domain/strategy/models/position.model';

export interface Marker {
    readonly id: string;
    readonly position: Position;
    readonly createdAt: Date;
    readonly updatedAt: Date;
}
