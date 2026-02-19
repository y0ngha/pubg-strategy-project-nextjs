import { CommentId } from '@domain/strategy/value-objects/comment-id';
import { Position } from '@domain/strategy/value-objects/position';
import { UserId } from '@domain/shared/value-objects/user-id';
import { Email } from '@domain/shared/value-objects/email';
import { CommentContent } from '@domain/strategy/value-objects/comment-content';

export interface Comment {
    readonly id: CommentId;
    readonly position: Position | null;
    readonly authorId: UserId;
    readonly authorEmail: Email;
    readonly content: CommentContent;
    readonly parentCommentId: CommentId | null;
    readonly createdAt: Date;
    readonly updatedAt: Date;
}
