import { CommentId } from '@domain/strategy/value-objects/comment-id';
import { Position } from '@domain/strategy/value-objects/position';
import { UserId } from '@domain/shared/value-objects/user-id';
import { Email } from '@domain/shared/value-objects/email';
import {
    ChildCommentException,
    DeletedCommentException,
    InvalidAuthorException,
    SameContentException,
} from '@domain/strategy/exceptions/strategy.exceptions';
import { CommentContent } from '@domain/strategy/value-objects/comment-content';

export class Comment {
    private constructor(
        public readonly id: CommentId,
        private _position: Position,
        public readonly authorId: UserId,
        public readonly authorEmail: Email,
        private _content: CommentContent,
        public readonly parentCommentId: CommentId | null,
        private _isDeleted: boolean,
        public readonly createdAt: Date,
        private _updatedAt: Date
    ) {}

    get position(): Position {
        return this._position;
    }

    get content(): CommentContent {
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
        content: CommentContent,
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
        content: CommentContent,
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

    updateContent(userId: UserId, content: CommentContent) {
        this.ensureNotDeleted();
        this.ensureAuthor(userId);
        this.ensureDifferentContent(content);

        this._content = content;
        this._updatedAt = new Date();
    }

    updatePosition(userId: UserId, position: Position) {
        this.ensureNotDeleted();
        this.ensureParentComment();
        this.ensureAuthor(userId);

        if (this._position.equals(position)) return;

        this._position = position;
        this._updatedAt = new Date();
    }

    delete(userId: UserId) {
        this.ensureNotDeleted();
        this.ensureAuthor(userId);

        this._isDeleted = true;
    }

    private ensureAuthor(userId: UserId) {
        if (!this.authorId.equals(userId)) {
            throw new InvalidAuthorException();
        }
    }

    private ensureParentComment() {
        if (!this.isParent) {
            throw new ChildCommentException();
        }
    }

    private ensureNotDeleted() {
        if (this._isDeleted) {
            throw new DeletedCommentException();
        }
    }

    private ensureDifferentContent(content: CommentContent) {
        if (this._content.equals(content)) {
            throw new SameContentException();
        }
    }
}
