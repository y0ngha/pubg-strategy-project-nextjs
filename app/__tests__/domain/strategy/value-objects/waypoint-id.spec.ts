import { WaypointId } from '@domain/strategy/value-objects/waypoint-id';

describe('WaypointId', () => {
    const validUuid = '550e8400-e29b-41d4-a716-446655440000';

    describe('create', () => {
        it('유효한 UUID로 WaypointId를 생성한다', () => {
            // When
            const waypointId = WaypointId.create(validUuid);

            // Then
            expect(waypointId).toBeInstanceOf(WaypointId);
            expect(waypointId.toString()).toBe(validUuid);
        });

        it('빈 문자열은 에러를 던진다', () => {
            // When & Then
            expect(() => WaypointId.create('')).toThrow(
                'ID는 빈 값일 수 없습니다.'
            );
        });

        it('공백만 있는 문자열은 에러를 던진다', () => {
            // When & Then
            expect(() => WaypointId.create('   ')).toThrow(
                'ID는 빈 값일 수 없습니다.'
            );
        });

        it('잘못된 UUID 형식은 에러를 던진다', () => {
            // When & Then
            expect(() => WaypointId.create('invalid-uuid')).toThrow(
                'ID는 UUIDv4 형식이어야 합니다.'
            );
            expect(() => WaypointId.create('123456')).toThrow(
                'ID는 UUIDv4 형식이어야 합니다.'
            );
        });

        it('UUID v1 형식은 에러를 던진다', () => {
            const uuidV1 = '550e8400-e29b-11d4-a716-446655440000';

            // When & Then
            expect(() => WaypointId.create(uuidV1)).toThrow(
                'ID는 UUIDv4 형식이어야 합니다.'
            );
        });
    });

    describe('equals', () => {
        it('같은 값을 가진 WaypointId는 동등하다', () => {
            // Given
            const waypointId1 = WaypointId.create(validUuid);
            const waypointId2 = WaypointId.create(validUuid);

            // When & Then
            expect(waypointId1.equals(waypointId2)).toBe(true);
        });

        it('다른 값을 가진 WaypointId는 동등하지 않다', () => {
            // Given
            const waypointId1 = WaypointId.create(
                '550e8400-e29b-41d4-a716-446655440000'
            );
            const waypointId2 = WaypointId.create(
                '660e8400-e29b-41d4-a716-446655440000'
            );

            // When & Then
            expect(waypointId1.equals(waypointId2)).toBe(false);
        });

        it('WaypointId가 아닌 객체는 동등하지 않다', () => {
            // Given
            const waypointId = WaypointId.create(validUuid);
            const notWaypointId = { value: validUuid } as never;

            // When & Then
            expect(waypointId.equals(notWaypointId)).toBe(false);
        });
    });

    describe('toString', () => {
        it('원시 값을 반환한다', () => {
            // Given
            const waypointId = WaypointId.create(validUuid);

            // When
            const result = waypointId.toString();

            // Then
            expect(result).toBe(validUuid);
        });
    });

    describe('toJSON', () => {
        it('JSON 직렬화 시 원시 값을 반환한다', () => {
            // Given
            const waypointId = WaypointId.create(validUuid);

            // When
            const result = JSON.stringify({ waypointId });

            // Then
            expect(result).toBe(`{"waypointId":"${validUuid}"}`);
        });
    });
});
