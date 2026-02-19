import { Position } from '@domain/strategy/models/position.model';

export interface Tag {
    readonly id: string;
    readonly position: Position;
    readonly content: string;
    readonly createdAt: Date;
    readonly updatedAt: Date;
}
