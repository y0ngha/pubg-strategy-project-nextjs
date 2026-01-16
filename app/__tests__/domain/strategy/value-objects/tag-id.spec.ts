import { TagId } from '@domain/strategy/value-objects/tag-id';
import {
    EntityIdBlankException,
    InvalidEntityIdException,
} from '@domain/shared/exceptions/entity-id.exceptions';

describe('TagId', () => {
    const validUuid = '550e8400-e29b-41d4-a716-446655440000';

    describe('create', () => {
        it('유효한 UUID로 TagId를 생성한다', () => {
            // When
            const tagId = TagId.create(validUuid);

            // Then
            expect(tagId).toBeInstanceOf(TagId);
            expect(tagId.toString()).toBe(validUuid);
        });

        it('빈 문자열은 에러를 던진다', () => {
            // When & Then
            expect(() => TagId.create('')).toThrow('ID는 빈 값일 수 없습니다.');
        });

        it('공백만 있는 문자열은 에러를 던진다', () => {
            // When & Then
            expect(() => TagId.create('   ')).toThrow(EntityIdBlankException);
        });

        it('잘못된 UUID 형식은 에러를 던진다', () => {
            // When & Then
            expect(() => TagId.create('invalid-uuid')).toThrow(
                InvalidEntityIdException
            );
            expect(() => TagId.create('123456')).toThrow(
                InvalidEntityIdException
            );
        });

        it('UUID v1 형식은 에러를 던진다', () => {
            const uuidV1 = '550e8400-e29b-11d4-a716-446655440000';

            // When & Then
            expect(() => TagId.create(uuidV1)).toThrow(
                InvalidEntityIdException
            );
        });
    });

    describe('equals', () => {
        it('같은 값을 가진 TagId는 동등하다', () => {
            // Given
            const tagId1 = TagId.create(validUuid);
            const tagId2 = TagId.create(validUuid);

            // When & Then
            expect(tagId1.equals(tagId2)).toBe(true);
        });

        it('다른 값을 가진 TagId는 동등하지 않다', () => {
            // Given
            const tagId1 = TagId.create('550e8400-e29b-41d4-a716-446655440000');
            const tagId2 = TagId.create('660e8400-e29b-41d4-a716-446655440000');

            // When & Then
            expect(tagId1.equals(tagId2)).toBe(false);
        });

        it('TagId가 아닌 객체는 동등하지 않다', () => {
            // Given
            const tagId = TagId.create(validUuid);
            const notTagId = { value: validUuid } as never;

            // When & Then
            expect(tagId.equals(notTagId)).toBe(false);
        });
    });

    describe('toString', () => {
        it('원시 값을 반환한다', () => {
            // Given
            const tagId = TagId.create(validUuid);

            // When
            const result = tagId.toString();

            // Then
            expect(result).toBe(validUuid);
        });
    });

    describe('toJSON', () => {
        it('JSON 직렬화 시 원시 값을 반환한다', () => {
            // Given
            const tagId = TagId.create(validUuid);

            // When
            const result = JSON.stringify({ tagId });

            // Then
            expect(result).toBe(`{"tagId":"${validUuid}"}`);
        });
    });
});
