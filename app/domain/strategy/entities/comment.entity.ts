import { CommentId } from '@domain/strategy/value-objects/comment-id';
import { Position } from '@domain/strategy/value-objects/position';
import { UserId } from '@domain/shared/value-objects/user-id';
import { Email } from '@domain/shared/value-objects/email';
import {
    CommentContentBlankException,
    DeletedCommentException,
    InvalidAuthorException,
    SameContentException,
} from '@domain/strategy/exceptions/strategy.exceptions';

export class Comment {
    private constructor(
        public readonly id: CommentId,
        public readonly position: Position,
        public readonly authorId: UserId,
        public readonly authorEmail: Email,
        content: string,
        public readonly parentCommentId: CommentId | null,
        private _isDeleted: boolean,
        public readonly createdAt: Date,
        private _updatedAt: Date
    ) {
        const trimmed = content.trim();
        this.ensureContentNotBlank(trimmed);

        this._content = trimmed;
    }

    private _content: string;

    get content(): string {
        return this._content;
    }

    get isDeleted(): boolean {
        return this._isDeleted;
    }

    get updatedAt(): Date {
        return this._updatedAt;
    }

    get isChild(): boolean {
        return this.parentCommentId !== null;
    }

    get isParent(): boolean {
        return this.parentCommentId === null;
    }

    static create(
        position: Position,
        authorId: UserId,
        authorEmail: Email,
        content: string,
        parentCommentId: CommentId | null
    ) {
        return new Comment(
            CommentId.generate(),
            position,
            authorId,
            authorEmail,
            content,
            parentCommentId,
            false,
            new Date(),
            new Date()
        );
    }

    static reconstruct(
        id: CommentId,
        position: Position,
        authorId: UserId,
        authorEmail: Email,
        content: string,
        parentCommentId: CommentId | null,
        createdAt: Date,
        updatedAt: Date
    ) {
        return new Comment(
            id,
            position,
            authorId,
            authorEmail,
            content,
            parentCommentId,
            false,
            createdAt,
            updatedAt
        );
    }

    updateContent(userId: UserId, content: string) {
        this.validateAuthor(userId);
        this.ensureNotDeleted();

        const trimmed = content.trim();
        this.ensureContentNotBlank(trimmed);
        this.ensureDifferentContent(trimmed);

        this._content = trimmed;
        this._updatedAt = new Date();
    }

    delete(userId: UserId) {
        this.validateAuthor(userId);
        this.ensureNotDeleted();

        this._isDeleted = true;
    }

    private validateAuthor(userId: UserId) {
        if (!this.authorId.equals(userId)) {
            throw new InvalidAuthorException();
        }
    }

    private ensureNotDeleted() {
        if (this._isDeleted) {
            throw new DeletedCommentException();
        }
    }

    private ensureContentNotBlank(content: string) {
        if (!content || content.length === 0) {
            throw new CommentContentBlankException();
        }
    }

    private ensureDifferentContent(content: string) {
        if (this._content === content) {
            throw new SameContentException();
        }
    }
}
