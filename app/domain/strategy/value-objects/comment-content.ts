import { CommentContentBlankException } from '@domain/strategy/exceptions/strategy.exceptions';

export class CommentContent {
    private constructor(public readonly content: string) {}

    static create(content: string) {
        const trimmed = content.trim();

        CommentContent.ensureContentNotBlank(trimmed);

        return new CommentContent(trimmed);
    }

    static reconstruct(content: string) {
        return new CommentContent(content);
    }

    private static ensureContentNotBlank(content: string) {
        if (!content || content.length === 0) {
            throw new CommentContentBlankException();
        }
    }

    equals(commentContent: CommentContent) {
        if (!(commentContent instanceof CommentContent)) {
            return false;
        }

        return this.content === commentContent.content;
    }

    toString() {
        return this.content;
    }

    toJSON() {
        return this.content;
    }
}
