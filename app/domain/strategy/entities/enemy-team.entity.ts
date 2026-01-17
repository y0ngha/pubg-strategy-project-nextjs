import { EnemyTeamId } from '@domain/strategy/value-objects/enemy-team-id';
import { TeamLabel } from '@domain/strategy/value-objects/team-label';
import { Position } from '@domain/strategy/value-objects/position';
import { DeletedEnemyTeamException } from '@domain/strategy/exceptions/strategy.exceptions';

export class EnemyTeam {
    private constructor(
        public readonly id: EnemyTeamId,
        private _teamLabel: TeamLabel,
        private _position: Position,
        private _isDeleted: boolean,
        public readonly createdAt: Date,
        private _updatedAt: Date
    ) {}

    get teamLabel(): TeamLabel {
        return this._teamLabel;
    }

    get position(): Position {
        return this._position;
    }

    get updatedAt(): Date {
        return this._updatedAt;
    }

    get isDeleted(): boolean {
        return this._isDeleted;
    }

    static create(teamLabel: TeamLabel, position: Position) {
        return new EnemyTeam(
            EnemyTeamId.generate(),
            teamLabel,
            position,
            false,
            new Date(),
            new Date()
        );
    }

    static reconstruct(
        id: EnemyTeamId,
        teamLabel: TeamLabel,
        position: Position,
        createdAt: Date,
        updatedAt: Date
    ) {
        return new EnemyTeam(
            id,
            teamLabel,
            position,
            false,
            createdAt,
            updatedAt
        );
    }

    updateTeamLabel(teamLabel: TeamLabel): boolean {
        this.ensureNotDeleted();

        if (this._teamLabel.equals(teamLabel)) return false;

        this._teamLabel = teamLabel;
        this._updatedAt = new Date();

        return true;
    }

    updatePosition(position: Position): boolean {
        this.ensureNotDeleted();

        if (this._position.equals(position)) return false;

        this._position = position;
        this._updatedAt = new Date();

        return true;
    }

    delete() {
        this.ensureNotDeleted();

        this._isDeleted = true;
    }

    private ensureNotDeleted() {
        if (this._isDeleted) {
            throw new DeletedEnemyTeamException();
        }
    }
}
