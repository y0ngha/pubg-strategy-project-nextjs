import { Position } from '@domain/strategy/models/position.model';

export interface EnemyTeam {
    readonly id: string;
    readonly teamLabel: string;
    readonly position: Position;
    readonly createdAt: Date;
    readonly updatedAt: Date;
}
