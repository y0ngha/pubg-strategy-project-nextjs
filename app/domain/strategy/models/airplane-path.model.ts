import { Position } from '@domain/strategy/models/position.model';

export interface AirplanePath {
    readonly id: string;
    readonly startPosition: Position;
    readonly endPosition: Position;
    readonly createdAt: Date;
    readonly updatedAt: Date;
}
