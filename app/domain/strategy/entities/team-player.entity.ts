import { TeamPlayerId } from '@domain/strategy/value-objects/team-player-id';
import { Marker } from '@domain/strategy/entities/marker.entity';
import { Waypoint } from '@domain/strategy/entities/waypoint.entity';
import { Position } from '@domain/strategy/value-objects/position';
import { PlayerColor } from '@domain/strategy/enums/player-color.enum';
import {
    DeletedTeamPlayerException,
    InvalidTeamPlayerPriorityException,
    MarkerExistsException,
    MarkerNotFoundException,
    WaypointExistsException,
    WaypointNotFoundException,
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
    ) {}

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
        TeamPlayer.ensureValidPriority(priority);

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

    private static ensureValidPriority(priority: number) {
        if (priority > TeamPlayer.MAX_PRIORITY) {
            throw new InvalidTeamPlayerPriorityException();
        }

        if (priority < TeamPlayer.MIN_PRIORITY) {
            throw new InvalidTeamPlayerPriorityException();
        }
    }

    updatePosition(position: Position): boolean {
        this.ensureNotDeleted();

        if (this._position.equals(position)) return false;

        this._position = position;
        this._updatedAt = new Date();

        return true;
    }

    updateMarkerPosition(position: Position): boolean {
        this.ensureNotDeleted();
        this.ensureHaveMarker(this._marker);

        const isChanged = this._marker.updatePosition(position);

        if (isChanged) {
            this._updatedAt = new Date();
        }

        return isChanged;
    }

    updateWaypointPositions(positions: Position[]): boolean {
        this.ensureNotDeleted();
        this.ensureHaveWaypoint(this._waypoint);

        const isChanged = this._waypoint.updatePositions(positions);

        if (isChanged) {
            this._updatedAt = new Date();
        }

        return isChanged;
    }

    addMarker(position: Position) {
        this.ensureNotDeleted();
        this.ensureNoHaveMarker();

        this._marker = Marker.create(position);
        this._updatedAt = new Date();
    }

    addWaypoint(positions: Position[]) {
        this.ensureNotDeleted();
        this.ensureNoHaveWaypoint();

        this._waypoint = Waypoint.create(positions);
        this._updatedAt = new Date();
    }

    deleteMarker(): boolean {
        this.ensureNotDeleted();
        this.ensureHaveMarker(this._marker);

        this._marker.delete();
        this._marker = null;
        this._updatedAt = new Date();

        return true;
    }

    deleteWaypoint(): boolean {
        this.ensureNotDeleted();
        this.ensureHaveWaypoint(this._waypoint);

        this._waypoint.delete();
        this._waypoint = null;
        this._updatedAt = new Date();

        return true;
    }

    delete() {
        this.ensureNotDeleted();

        if (this._marker) {
            this.deleteMarker();
        }

        if (this._waypoint) {
            this.deleteWaypoint();
        }

        this._isDeleted = true;
    }

    private ensureNotDeleted() {
        if (this._isDeleted) {
            throw new DeletedTeamPlayerException();
        }
    }

    private ensureHaveMarker(marker: Marker | null): asserts marker is Marker {
        if (!marker) {
            throw new MarkerNotFoundException();
        }
    }

    private ensureNoHaveMarker() {
        if (this._marker) {
            throw new MarkerExistsException();
        }
    }

    private ensureHaveWaypoint(
        waypoint: Waypoint | null
    ): asserts waypoint is Waypoint {
        if (!waypoint) {
            throw new WaypointNotFoundException();
        }
    }

    private ensureNoHaveWaypoint() {
        if (this._waypoint) {
            throw new WaypointExistsException();
        }
    }
}
