import { StrategyId } from '@domain/strategy/value-objects/strategy-id';

describe('StrategyId', () => {
    const validUuid = '550e8400-e29b-41d4-a716-446655440000';

    describe('create', () => {
        it('유효한 UUID로 StrategyId를 생성한다', () => {
            // When
            const strategyId = StrategyId.create(validUuid);

            // Then
            expect(strategyId).toBeInstanceOf(StrategyId);
            expect(strategyId.toString()).toBe(validUuid);
        });

        it('빈 문자열은 에러를 던진다', () => {
            // When & Then
            expect(() => StrategyId.create('')).toThrow(
                'ID는 빈 값일 수 없습니다.'
            );
        });

        it('공백만 있는 문자열은 에러를 던진다', () => {
            // When & Then
            expect(() => StrategyId.create('   ')).toThrow(
                'ID는 빈 값일 수 없습니다.'
            );
        });

        it('잘못된 UUID 형식은 에러를 던진다', () => {
            // When & Then
            expect(() => StrategyId.create('invalid-uuid')).toThrow(
                'ID는 UUIDv4 형식이어야 합니다.'
            );
            expect(() => StrategyId.create('123456')).toThrow(
                'ID는 UUIDv4 형식이어야 합니다.'
            );
        });

        it('UUID v1 형식은 에러를 던진다', () => {
            const uuidV1 = '550e8400-e29b-11d4-a716-446655440000';

            // When & Then
            expect(() => StrategyId.create(uuidV1)).toThrow(
                'ID는 UUIDv4 형식이어야 합니다.'
            );
        });
    });

    describe('equals', () => {
        it('같은 값을 가진 StrategyId는 동등하다', () => {
            // Given
            const strategyId1 = StrategyId.create(validUuid);
            const strategyId2 = StrategyId.create(validUuid);

            // When & Then
            expect(strategyId1.equals(strategyId2)).toBe(true);
        });

        it('다른 값을 가진 StrategyId는 동등하지 않다', () => {
            // Given
            const strategyId1 = StrategyId.create(
                '550e8400-e29b-41d4-a716-446655440000'
            );
            const strategyId2 = StrategyId.create(
                '660e8400-e29b-41d4-a716-446655440000'
            );

            // When & Then
            expect(strategyId1.equals(strategyId2)).toBe(false);
        });

        it('StrategyId가 아닌 객체는 동등하지 않다', () => {
            // Given
            const strategyId = StrategyId.create(validUuid);
            const notStrategyId = { value: validUuid } as never;

            // When & Then
            expect(strategyId.equals(notStrategyId)).toBe(false);
        });
    });

    describe('toString', () => {
        it('원시 값을 반환한다', () => {
            // Given
            const strategyId = StrategyId.create(validUuid);

            // When
            const result = strategyId.toString();

            // Then
            expect(result).toBe(validUuid);
        });
    });

    describe('toJSON', () => {
        it('JSON 직렬화 시 원시 값을 반환한다', () => {
            // Given
            const strategyId = StrategyId.create(validUuid);

            // When
            const result = JSON.stringify({ strategyId });

            // Then
            expect(result).toBe(`{"strategyId":"${validUuid}"}`);
        });
    });
});
