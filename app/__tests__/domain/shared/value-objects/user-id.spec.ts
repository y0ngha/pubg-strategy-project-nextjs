import { UserId } from '@domain/shared/value-objects/user-id';

describe('UserId', () => {
    const validUuid = '550e8400-e29b-41d4-a716-446655440000';

    describe('create', () => {
        it('유효한 UUID로 UserId를 생성한다', () => {
            // When
            const userId = UserId.create(validUuid);

            // Then
            expect(userId).toBeInstanceOf(UserId);
            expect(userId.toString()).toBe(validUuid);
        });

        it('빈 문자열은 에러를 던진다', () => {
            // When & Then
            expect(() => UserId.create('')).toThrow(
                '유저ID는 빈 값일 수 없습니다.'
            );
        });

        it('공백만 있는 문자열은 에러를 던진다', () => {
            // When & Then
            expect(() => UserId.create('   ')).toThrow(
                '유저ID는 빈 값일 수 없습니다.'
            );
        });

        it('잘못된 UUID 형식은 에러를 던진다', () => {
            // When & Then
            expect(() => UserId.create('invalid-uuid')).toThrow(
                '유저ID는 UUIDv4 형식이어야 합니다.'
            );
            expect(() => UserId.create('123456')).toThrow(
                '유저ID는 UUIDv4 형식이어야 합니다.'
            );
        });

        it('UUID v1 형식은 에러를 던진다', () => {
            const uuidV1 = '550e8400-e29b-11d4-a716-446655440000';

            // When & Then
            expect(() => UserId.create(uuidV1)).toThrow(
                '유저ID는 UUIDv4 형식이어야 합니다.'
            );
        });
    });

    describe('equals', () => {
        it('같은 값을 가진 UserId는 동등하다', () => {
            // Given
            const userId1 = UserId.create(validUuid);
            const userId2 = UserId.create(validUuid);

            // When & Then
            expect(userId1.equals(userId2)).toBe(true);
        });

        it('다른 값을 가진 UserId는 동등하지 않다', () => {
            // Given
            const userId1 = UserId.create(
                '550e8400-e29b-41d4-a716-446655440000'
            );
            const userId2 = UserId.create(
                '660e8400-e29b-41d4-a716-446655440000'
            );

            // When & Then
            expect(userId1.equals(userId2)).toBe(false);
        });

        it('UserId가 아닌 객체는 동등하지 않다', () => {
            // Given
            const userId = UserId.create(validUuid);
            const notUserId = { value: validUuid } as never;

            // When & Then
            expect(userId.equals(notUserId)).toBe(false);
        });
    });

    describe('toString', () => {
        it('원시 값을 반환한다', () => {
            // Given
            const userId = UserId.create(validUuid);

            // When
            const result = userId.toString();

            // Then
            expect(result).toBe(validUuid);
        });
    });

    describe('toJSON', () => {
        it('JSON 직렬화 시 원시 값을 반환한다', () => {
            // Given
            const userId = UserId.create(validUuid);

            // When
            const result = JSON.stringify({ userId });

            // Then
            expect(result).toBe(`{"userId":"${validUuid}"}`);
        });
    });
});
