import { Position } from '@domain/strategy/value-objects/position';
import { TagId } from '@domain/strategy/value-objects/tag-id';
import {
    DeletedTagException,
    SamePositionException,
} from '@domain/strategy/exceptions/strategy.exceptions';
import { TagContent } from '@domain/strategy/value-objects/tag-content';

export class Tag {
    private constructor(
        public readonly id: TagId,
        private _position: Position,
        private _content: TagContent,
        private _isDeleted: boolean,
        public readonly createdAt: Date,
        private _updatedAt: Date
    ) {}

    get content(): TagContent {
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

    static create(position: Position, content: TagContent) {
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
        content: TagContent,
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

    updateContent(content: TagContent) {
        this.ensureNotDeleted();

        if (this._content.equals(content)) return;

        this._content = content;
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
}
