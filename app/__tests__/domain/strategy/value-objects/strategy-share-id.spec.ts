import { StrategyShareId } from '@domain/strategy/value-objects/strategy-share-id';
import {
    EntityIdBlankException,
    InvalidEntityIdException,
} from '@domain/shared/exceptions/entity-id.exceptions';

describe('StrategyShareId', () => {
    const validUuid = '550e8400-e29b-41d4-a716-446655440000';

    describe('create', () => {
        it('유효한 UUID로 StrategyShareId를 생성한다', () => {
            // When
            const strategyShareId = StrategyShareId.create(validUuid);

            // Then
            expect(strategyShareId).toBeInstanceOf(StrategyShareId);
            expect(strategyShareId.toString()).toBe(validUuid);
        });

        it('빈 문자열은 에러를 던진다', () => {
            // When & Then
            expect(() => StrategyShareId.create('')).toThrow(
                EntityIdBlankException
            );
        });

        it('공백만 있는 문자열은 에러를 던진다', () => {
            // When & Then
            expect(() => StrategyShareId.create('   ')).toThrow(
                EntityIdBlankException
            );
        });

        it('잘못된 UUID 형식은 에러를 던진다', () => {
            // When & Then
            expect(() => StrategyShareId.create('invalid-uuid')).toThrow(
                InvalidEntityIdException
            );
            expect(() => StrategyShareId.create('123456')).toThrow(
                InvalidEntityIdException
            );
        });

        it('UUID v1 형식은 에러를 던진다', () => {
            const uuidV1 = '550e8400-e29b-11d4-a716-446655440000';

            // When & Then
            expect(() => StrategyShareId.create(uuidV1)).toThrow(
                InvalidEntityIdException
            );
        });
    });

    describe('equals', () => {
        it('같은 값을 가진 StrategyShareId는 동등하다', () => {
            // Given
            const strategyShareId1 = StrategyShareId.create(validUuid);
            const strategyShareId2 = StrategyShareId.create(validUuid);

            // When & Then
            expect(strategyShareId1.equals(strategyShareId2)).toBe(true);
        });

        it('다른 값을 가진 StrategyShareId는 동등하지 않다', () => {
            // Given
            const strategyShareId1 = StrategyShareId.create(
                '550e8400-e29b-41d4-a716-446655440000'
            );
            const strategyShareId2 = StrategyShareId.create(
                '660e8400-e29b-41d4-a716-446655440000'
            );

            // When & Then
            expect(strategyShareId1.equals(strategyShareId2)).toBe(false);
        });

        it('StrategyShareId가 아닌 객체는 동등하지 않다', () => {
            // Given
            const strategyShareId = StrategyShareId.create(validUuid);
            const notStrategyShareId = { value: validUuid } as never;

            // When & Then
            expect(strategyShareId.equals(notStrategyShareId)).toBe(false);
        });
    });

    describe('toString', () => {
        it('원시 값을 반환한다', () => {
            // Given
            const strategyShareId = StrategyShareId.create(validUuid);

            // When
            const result = strategyShareId.toString();

            // Then
            expect(result).toBe(validUuid);
        });
    });

    describe('toJSON', () => {
        it('JSON 직렬화 시 원시 값을 반환한다', () => {
            // Given
            const strategyShareId = StrategyShareId.create(validUuid);

            // When
            const result = JSON.stringify({ strategyShareId });

            // Then
            expect(result).toBe(`{"strategyShareId":"${validUuid}"}`);
        });
    });
});
