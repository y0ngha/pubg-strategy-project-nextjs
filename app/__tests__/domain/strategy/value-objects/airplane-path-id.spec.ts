import { AirplanePathId } from '@domain/strategy/value-objects/airplane-path-id';
import {
    EntityIdBlankException,
    InvalidEntityIdException,
} from '@domain/shared/exceptions/entity-id.exceptions';

describe('AirplanePathId', () => {
    const validUuid = '550e8400-e29b-41d4-a716-446655440000';

    describe('create', () => {
        it('유효한 UUID로 AirplanePathId를 생성한다', () => {
            // When
            const airplanePathId = AirplanePathId.create(validUuid);

            // Then
            expect(airplanePathId).toBeInstanceOf(AirplanePathId);
            expect(airplanePathId.toString()).toBe(validUuid);
        });

        it('빈 문자열은 에러를 던진다', () => {
            // When & Then
            expect(() => AirplanePathId.create('')).toThrow(
                EntityIdBlankException
            );
        });

        it('공백만 있는 문자열은 에러를 던진다', () => {
            // When & Then
            expect(() => AirplanePathId.create('   ')).toThrow(
                EntityIdBlankException
            );
        });

        it('잘못된 UUID 형식은 에러를 던진다', () => {
            // When & Then
            expect(() => AirplanePathId.create('invalid-uuid')).toThrow(
                InvalidEntityIdException
            );
            expect(() => AirplanePathId.create('123456')).toThrow(
                InvalidEntityIdException
            );
        });

        it('UUID v1 형식은 에러를 던진다', () => {
            const uuidV1 = '550e8400-e29b-11d4-a716-446655440000';

            // When & Then
            expect(() => AirplanePathId.create(uuidV1)).toThrow(
                InvalidEntityIdException
            );
        });
    });

    describe('reconstruct', () => {
        it('재생성되는 값을 그대로 신뢰하여 유효성 검사 없이 생성된다.', () => {
            // given
            const value = '잘못된 값';

            // when
            const id = AirplanePathId.reconstruct(value);

            // then
            expect(id.toString()).toEqual(value);
        });
    });

    describe('equals', () => {
        it('같은 값을 가진 AirplanePathId는 동등하다', () => {
            // Given
            const airplanePathId1 = AirplanePathId.create(validUuid);
            const airplanePathId2 = AirplanePathId.create(validUuid);

            // When & Then
            expect(airplanePathId1.equals(airplanePathId2)).toBe(true);
        });

        it('다른 값을 가진 AirplanePathId는 동등하지 않다', () => {
            // Given
            const airplanePathId1 = AirplanePathId.create(
                '550e8400-e29b-41d4-a716-446655440000'
            );
            const airplanePathId2 = AirplanePathId.create(
                '660e8400-e29b-41d4-a716-446655440000'
            );

            // When & Then
            expect(airplanePathId1.equals(airplanePathId2)).toBe(false);
        });

        it('AirplanePathId가 아닌 객체는 동등하지 않다', () => {
            // Given
            const airplanePathId = AirplanePathId.create(validUuid);
            const notAirplanePathId = { value: validUuid } as never;

            // When & Then
            expect(airplanePathId.equals(notAirplanePathId)).toBe(false);
        });
    });

    describe('toString', () => {
        it('원시 값을 반환한다', () => {
            // Given
            const airplanePathId = AirplanePathId.create(validUuid);

            // When
            const result = airplanePathId.toString();

            // Then
            expect(result).toBe(validUuid);
        });
    });

    describe('toJSON', () => {
        it('JSON 직렬화 시 원시 값을 반환한다', () => {
            // Given
            const airplanePathId = AirplanePathId.create(validUuid);

            // When
            const result = JSON.stringify({ airplanePathId });

            // Then
            expect(result).toBe(`{"airplanePathId":"${validUuid}"}`);
        });
    });
});
