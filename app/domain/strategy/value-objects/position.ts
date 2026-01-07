export class Position {
    private constructor(
        public readonly x: number,
        public readonly y: number
    ) {}

    static create(x: number, y: number) {
        return new Position(x, y);
    }

    equals(position: Position) {
        if (!(position instanceof Position)) {
            return false;
        }

        return this.x === position.x && this.y === position.y;
    }

    toJSON() {
        return {
            x: this.x,
            y: this.y,
        };
    }
}
