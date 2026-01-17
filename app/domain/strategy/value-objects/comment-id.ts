import { EntityId } from '@domain/shared/value-objects/entity-id';

export class CommentId extends EntityId {
    private constructor(value: string) {
        super(value);
    }

    static create(value: string): CommentId {
        EntityId.validateEntityId(value);
        return new CommentId(value);
    }

    static reconstruct(value: string): CommentId {
        return new CommentId(value);
    }

    static generate(): CommentId {
        return new CommentId(EntityId.generateUuid());
    }

    equals(commentId: CommentId): boolean {
        if (!(commentId instanceof CommentId)) {
            return false;
        }

        return this.value === commentId.value;
    }
}
