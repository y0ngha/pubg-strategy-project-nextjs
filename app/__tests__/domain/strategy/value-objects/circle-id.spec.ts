import { CircleId } from '@domain/strategy/value-objects/circle-id';
import {
    EntityIdBlankException,
    InvalidEntityIdException,
} from '@domain/shared/exceptions/entity-id.exceptions';

describe('CircleId', () => {
    const validUuid = '550e8400-e29b-41d4-a716-446655440000';

    describe('create', () => {
        it('유효한 UUID로 CircleId를 생성한다', () => {
            // When
            const circleId = CircleId.create(validUuid);

            // Then
            expect(circleId).toBeInstanceOf(CircleId);
            expect(circleId.toString()).toBe(validUuid);
        });

        it('빈 문자열은 에러를 던진다', () => {
            // When & Then
            expect(() => CircleId.create('')).toThrow(EntityIdBlankException);
        });

        it('공백만 있는 문자열은 에러를 던진다', () => {
            // When & Then
            expect(() => CircleId.create('   ')).toThrow(
                EntityIdBlankException
            );
        });

        it('잘못된 UUID 형식은 에러를 던진다', () => {
            // When & Then
            expect(() => CircleId.create('invalid-uuid')).toThrow(
                InvalidEntityIdException
            );
            expect(() => CircleId.create('123456')).toThrow(
                InvalidEntityIdException
            );
        });

        it('UUID v1 형식은 에러를 던진다', () => {
            const uuidV1 = '550e8400-e29b-11d4-a716-446655440000';

            // When & Then
            expect(() => CircleId.create(uuidV1)).toThrow(
                InvalidEntityIdException
            );
        });
    });

    describe('equals', () => {
        it('같은 값을 가진 CircleId는 동등하다', () => {
            // Given
            const circleId1 = CircleId.create(validUuid);
            const circleId2 = CircleId.create(validUuid);

            // When & Then
            expect(circleId1.equals(circleId2)).toBe(true);
        });

        it('다른 값을 가진 CircleId는 동등하지 않다', () => {
            // Given
            const circleId1 = CircleId.create(
                '550e8400-e29b-41d4-a716-446655440000'
            );
            const circleId2 = CircleId.create(
                '660e8400-e29b-41d4-a716-446655440000'
            );

            // When & Then
            expect(circleId1.equals(circleId2)).toBe(false);
        });

        it('CircleId가 아닌 객체는 동등하지 않다', () => {
            // Given
            const circleId = CircleId.create(validUuid);
            const notCircleId = { value: validUuid } as never;

            // When & Then
            expect(circleId.equals(notCircleId)).toBe(false);
        });
    });

    describe('toString', () => {
        it('원시 값을 반환한다', () => {
            // Given
            const circleId = CircleId.create(validUuid);

            // When
            const result = circleId.toString();

            // Then
            expect(result).toBe(validUuid);
        });
    });

    describe('toJSON', () => {
        it('JSON 직렬화 시 원시 값을 반환한다', () => {
            // Given
            const circleId = CircleId.create(validUuid);

            // When
            const result = JSON.stringify({ circleId });

            // Then
            expect(result).toBe(`{"circleId":"${validUuid}"}`);
        });
    });
});
