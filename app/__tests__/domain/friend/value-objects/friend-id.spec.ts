import { FriendId } from '@domain/friend/value-objects/friend-id';

describe('FriendId', () => {
    const validUuid = '550e8400-e29b-41d4-a716-446655440000';

    describe('create', () => {
        it('유효한 UUID로 FriendId를 생성한다', () => {
            // When
            const friendId = FriendId.create(validUuid);

            // Then
            expect(friendId).toBeInstanceOf(FriendId);
            expect(friendId.toString()).toBe(validUuid);
        });

        it('빈 문자열은 에러를 던진다', () => {
            // When & Then
            expect(() => FriendId.create('')).toThrow(
                'Friend ID는 빈 값일 수 없습니다.'
            );
        });

        it('공백만 있는 문자열은 에러를 던진다', () => {
            // When & Then
            expect(() => FriendId.create('   ')).toThrow(
                'Friend ID는 빈 값일 수 없습니다.'
            );
        });

        it('잘못된 UUID 형식은 에러를 던진다', () => {
            // When & Then
            expect(() => FriendId.create('invalid-uuid')).toThrow(
                'Friend ID는 UUIDv4 형식이어야 합니다.'
            );
            expect(() => FriendId.create('123456')).toThrow(
                'Friend ID는 UUIDv4 형식이어야 합니다.'
            );
        });

        it('UUID v1 형식은 에러를 던진다', () => {
            const uuidV1 = '550e8400-e29b-11d4-a716-446655440000';

            // When & Then
            expect(() => FriendId.create(uuidV1)).toThrow(
                'Friend ID는 UUIDv4 형식이어야 합니다.'
            );
        });
    });

    describe('equals', () => {
        it('같은 값을 가진 FriendId는 동등하다', () => {
            // Given
            const friendId1 = FriendId.create(validUuid);
            const friendId2 = FriendId.create(validUuid);

            // When & Then
            expect(friendId1.equals(friendId2)).toBe(true);
        });

        it('다른 값을 가진 FriendId는 동등하지 않다', () => {
            // Given
            const friendId1 = FriendId.create(
                '550e8400-e29b-41d4-a716-446655440000'
            );
            const friendId2 = FriendId.create(
                '660e8400-e29b-41d4-a716-446655440000'
            );

            // When & Then
            expect(friendId1.equals(friendId2)).toBe(false);
        });

        it('FriendId가 아닌 객체는 동등하지 않다', () => {
            // Given
            const friendId = FriendId.create(validUuid);
            const notFriendId = { value: validUuid } as never;

            // When & Then
            expect(friendId.equals(notFriendId)).toBe(false);
        });
    });

    describe('toString', () => {
        it('원시 값을 반환한다', () => {
            // Given
            const friendId = FriendId.create(validUuid);

            // When
            const result = friendId.toString();

            // Then
            expect(result).toBe(validUuid);
        });
    });

    describe('toJSON', () => {
        it('JSON 직렬화 시 원시 값을 반환한다', () => {
            // Given
            const friendId = FriendId.create(validUuid);

            // When
            const result = JSON.stringify({ friendId });

            // Then
            expect(result).toBe(`{"friendId":"${validUuid}"}`);
        });
    });
});
