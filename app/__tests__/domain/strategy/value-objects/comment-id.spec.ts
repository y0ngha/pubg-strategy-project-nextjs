import { CommentId } from '@domain/strategy/value-objects/comment-id';
import {
    EntityIdBlankException,
    InvalidEntityIdException,
} from '@domain/shared/exceptions/entity-id.exceptions';

describe('CommentId', () => {
    const validUuid = '550e8400-e29b-41d4-a716-446655440000';

    describe('create', () => {
        it('유효한 UUID로 CommentId를 생성한다', () => {
            // When
            const commentId = CommentId.create(validUuid);

            // Then
            expect(commentId).toBeInstanceOf(CommentId);
            expect(commentId.toString()).toBe(validUuid);
        });

        it('빈 문자열은 에러를 던진다', () => {
            // When & Then
            expect(() => CommentId.create('')).toThrow(EntityIdBlankException);
        });

        it('공백만 있는 문자열은 에러를 던진다', () => {
            // When & Then
            expect(() => CommentId.create('   ')).toThrow(
                EntityIdBlankException
            );
        });

        it('잘못된 UUID 형식은 에러를 던진다', () => {
            // When & Then
            expect(() => CommentId.create('invalid-uuid')).toThrow(
                InvalidEntityIdException
            );
            expect(() => CommentId.create('123456')).toThrow(
                InvalidEntityIdException
            );
        });

        it('UUID v1 형식은 에러를 던진다', () => {
            const uuidV1 = '550e8400-e29b-11d4-a716-446655440000';

            // When & Then
            expect(() => CommentId.create(uuidV1)).toThrow(
                InvalidEntityIdException
            );
        });
    });

    describe('reconstruct', () => {
        it('재생성되는 값을 그대로 신뢰하여 유효성 검사 없이 생성된다.', () => {
            // given
            const value = '잘못된 값';

            // when
            const id = CommentId.reconstruct(value);

            // then
            expect(id.toString()).toEqual(value);
        });
    });

    describe('equals', () => {
        it('같은 값을 가진 CommentId는 동등하다', () => {
            // Given
            const commentId1 = CommentId.create(validUuid);
            const commentId2 = CommentId.create(validUuid);

            // When & Then
            expect(commentId1.equals(commentId2)).toBe(true);
        });

        it('다른 값을 가진 CommentId는 동등하지 않다', () => {
            // Given
            const commentId1 = CommentId.create(
                '550e8400-e29b-41d4-a716-446655440000'
            );
            const commentId2 = CommentId.create(
                '660e8400-e29b-41d4-a716-446655440000'
            );

            // When & Then
            expect(commentId1.equals(commentId2)).toBe(false);
        });

        it('CommentId가 아닌 객체는 동등하지 않다', () => {
            // Given
            const commentId = CommentId.create(validUuid);
            const notCommentId = { value: validUuid } as never;

            // When & Then
            expect(commentId.equals(notCommentId)).toBe(false);
        });
    });

    describe('toString', () => {
        it('원시 값을 반환한다', () => {
            // Given
            const commentId = CommentId.create(validUuid);

            // When
            const result = commentId.toString();

            // Then
            expect(result).toBe(validUuid);
        });
    });

    describe('toJSON', () => {
        it('JSON 직렬화 시 원시 값을 반환한다', () => {
            // Given
            const commentId = CommentId.create(validUuid);

            // When
            const result = JSON.stringify({ commentId });

            // Then
            expect(result).toBe(`{"commentId":"${validUuid}"}`);
        });
    });
});
