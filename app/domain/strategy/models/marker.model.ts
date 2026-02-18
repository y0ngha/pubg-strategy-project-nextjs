import { MarkerId } from '@domain/strategy/value-objects/marker-id';
import { Position } from '@domain/strategy/value-objects/position';

export interface Marker {
    readonly id: MarkerId;
    readonly position: Position;
    readonly isDeleted: boolean;
    readonly createdAt: Date;
    readonly updatedAt: Date;
}
