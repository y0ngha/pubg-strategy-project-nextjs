import { TeamPlayerId } from '@domain/strategy/value-objects/team-player-id';
import { Marker } from '@domain/strategy/entities/marker.entity';
import { Waypoint } from '@domain/strategy/entities/waypoint.entity';
import { Position } from '@domain/strategy/value-objects/position';
import { PlayerColor } from '@domain/strategy/enums/player-color.enum';
import {
    DeletedTeamPlayerException,
    InvalidTeamPlayerPriorityException,
    SamePositionException,
} from '@domain/strategy/exceptions/strategy.exceptions';

export class TeamPlayer {
    private static readonly MAX_PRIORITY: number = 4;
    private static readonly MIN_PRIORITY: number = 1;

    private constructor(
        public readonly id: TeamPlayerId,
        public readonly priority: number,
        private _position: Position,
        private _marker: Marker | null,
        private _waypoint: Waypoint | null,
        private _isDeleted: boolean,
        public readonly createdAt: Date,
        private _updatedAt: Date
    ) {
        this.ensureValidPriority(priority);
    }

    get position(): Position {
        return this._position;
    }

    get marker(): Marker | null {
        return this._marker;
    }

    get waypoint(): Waypoint | null {
        return this._waypoint;
    }

    get isDeleted(): boolean {
        return this._isDeleted;
    }

    get updatedAt(): Date {
        return this._updatedAt;
    }

    get color(): PlayerColor {
        const colorMap: Record<number, PlayerColor> = {
            1: PlayerColor.RED,
            2: PlayerColor.ORANGE,
            3: PlayerColor.YELLOW,
            4: PlayerColor.GREEN,
        };
        return colorMap[this.priority];
    }

    get hasMarker(): boolean {
        return this._marker != null;
    }

    get hasWaypoint(): boolean {
        return this._waypoint != null;
    }

    static create(
        priority: number,
        position: Position,
        marker: Marker | null = null,
        waypoint: Waypoint | null = null
    ) {
        return new TeamPlayer(
            TeamPlayerId.generate(),
            priority,
            position,
            marker,
            waypoint,
            false,
            new Date(),
            new Date()
        );
    }

    static reconstruct(
        id: TeamPlayerId,
        priority: number,
        position: Position,
        marker: Marker | null,
        waypoint: Waypoint | null,
        createdAt: Date,
        updatedAt: Date
    ): TeamPlayer {
        return new TeamPlayer(
            id,
            priority,
            position,
            marker,
            waypoint,
            false,
            createdAt,
            updatedAt
        );
    }

    updatePosition(position: Position) {
        this.ensureNotDeleted();

        this.ensureDifferentPosition(position);

        this._position = position;
        this._updatedAt = new Date();
    }

    assignMarker(marker: Marker) {
        this.ensureNotDeleted();

        this._marker = marker;
        this._updatedAt = new Date();
    }

    assignWaypoint(waypoint: Waypoint) {
        this.ensureNotDeleted();

        this._waypoint = waypoint;
        this._updatedAt = new Date();
    }

    clearMarker() {
        this.ensureNotDeleted();
        this.deleteMarker();
        this.unassignMarker();
    }

    clearWaypoint() {
        this.ensureNotDeleted();
        this.deleteWaypoint();
        this.unassignWaypoint();
    }

    delete() {
        this.ensureNotDeleted();

        this._isDeleted = true;

        this.cascadeDelete();
        this.cascadeUnassign();
    }

    private deleteMarker() {
        if (this._marker) {
            this._marker.delete();
        }
    }

    private deleteWaypoint() {
        if (this._waypoint) {
            this._waypoint.delete();
        }
    }

    private unassignWaypoint() {
        if (this._waypoint) {
            this._waypoint = null;
            this._updatedAt = new Date();
        }
    }

    private unassignMarker() {
        if (this._marker) {
            this._marker = null;
            this._updatedAt = new Date();
        }
    }

    private cascadeDelete() {
        this.deleteMarker();
        this.deleteWaypoint();
    }

    private cascadeUnassign() {
        this.unassignMarker();
        this.unassignWaypoint();
    }

    private ensureNotDeleted() {
        if (this._isDeleted) {
            throw new DeletedTeamPlayerException();
        }
    }

    private ensureValidPriority(priority: number) {
        if (priority > TeamPlayer.MAX_PRIORITY) {
            throw new InvalidTeamPlayerPriorityException();
        }

        if (priority < TeamPlayer.MIN_PRIORITY) {
            throw new InvalidTeamPlayerPriorityException();
        }
    }

    private ensureDifferentPosition(position: Position) {
        if (this._position.equals(position)) {
            throw new SamePositionException();
        }
    }
}
