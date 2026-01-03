export class EntityId {
    private readonly value: string;

    constructor(value: string) {
        this.value = value;
    }

    toString(): string {
        return this.value;
    }

    toJSON(): string {
        return this.value;
    }
}
