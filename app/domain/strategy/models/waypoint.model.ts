import { Position } from '@domain/strategy/models/position.model';

export interface Waypoint {
    readonly id: string;
    readonly positions: Position[];
    readonly createdAt: Date;
    readonly updatedAt: Date;
}
