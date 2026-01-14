import { TagContentBlankException } from '@domain/strategy/exceptions/strategy.exceptions';

export class TagContent {
    private constructor(public readonly content: string) {}

    static create(content: string) {
        const trimmed = content.trim();

        TagContent.ensureContentNotBlank(trimmed);

        return new TagContent(trimmed);
    }

    static reconstruct(content: string) {
        return new TagContent(content);
    }

    private static ensureContentNotBlank(content: string) {
        if (!content || content.length === 0) {
            throw new TagContentBlankException();
        }
    }

    equals(tagContent: TagContent) {
        if (!(tagContent instanceof TagContent)) {
            return false;
        }

        return this.content === tagContent.content;
    }

    toString() {
        return this.content;
    }

    toJSON() {
        return this.content;
    }
}
