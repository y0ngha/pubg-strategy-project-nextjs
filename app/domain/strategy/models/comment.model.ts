import { Position } from './position.model';

export interface Comment {
    readonly id: string;
    readonly position: Position | null;
    readonly authorId: string;
    readonly authorEmail: string;
    readonly content: string;
    readonly parentCommentId: string | null;
    readonly createdAt: Date;
    readonly updatedAt: Date;
}
