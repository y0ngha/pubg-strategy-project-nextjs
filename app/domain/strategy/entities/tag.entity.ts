import { Position } from '@domain/strategy/value-objects/position';
import { TagId } from '@domain/strategy/value-objects/tag-id';
import {
    DeletedTagException,
    SamePositionException,
    TagContentBlankException,
} from '@domain/strategy/exceptions/strategy.exceptions';

export class Tag {
    private constructor(
        public readonly id: TagId,
        private _position: Position,
        content: string,
        private _isDeleted: boolean,
        public readonly createdAt: Date,
        private _updatedAt: Date
    ) {
        const trimmed = content.trim();
        this.ensureNotBlank(trimmed);
        this._content = trimmed;
    }

    private _content: string;

    get content(): string {
        return this._content;
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

    static create(position: Position, content: string) {
        return new Tag(
            TagId.generate(),
            position,
            content,
            false,
            new Date(),
            new Date()
        );
    }

    static reconstruct(
        id: TagId,
        position: Position,
        content: string,
        createdAt: Date,
        updatedAt: Date
    ) {
        return new Tag(id, position, content, false, createdAt, updatedAt);
    }

    updatePosition(position: Position) {
        this.ensureNotDeleted();
        this.ensureDifferentPosition(position);

        this._position = position;
        this._updatedAt = new Date();
    }

    updateContent(content: string) {
        const trimmed = content.trim();

        this.ensureNotDeleted();
        this.ensureNotBlank(trimmed);

        if (this._content === trimmed) return;

        this._content = trimmed;
        this._updatedAt = new Date();
    }

    delete() {
        this.ensureNotDeleted();

        this._isDeleted = true;
    }

    private ensureDifferentPosition(position: Position) {
        if (this._position.equals(position)) {
            throw new SamePositionException();
        }
    }

    private ensureNotDeleted() {
        if (this._isDeleted) {
            throw new DeletedTagException();
        }
    }

    private ensureNotBlank(content: string) {
        if (!content || content.length === 0) {
            throw new TagContentBlankException();
        }
    }
}
