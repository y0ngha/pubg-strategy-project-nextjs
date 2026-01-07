export class Position {
    public readonly x: number;
    public readonly y: number;

    private constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

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
