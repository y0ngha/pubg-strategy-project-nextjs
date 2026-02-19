import { Position } from '@domain/strategy/models/position.model';

export interface Circle {
    readonly id: string;
    readonly centerPosition: Position;
    readonly phase: number;
    readonly createdAt: Date;
    readonly updatedAt: Date;
}
