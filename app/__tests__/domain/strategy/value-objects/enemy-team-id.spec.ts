import { EnemyTeamId } from '@domain/strategy/value-objects/enemy-team-id';
import {
    EntityIdBlankException,
    InvalidEntityIdException,
} from '@domain/shared/exceptions/entity-id.exceptions';

describe('EnemyTeamId', () => {
    const validUuid = '550e8400-e29b-41d4-a716-446655440000';

    describe('create', () => {
        it('유효한 UUID로 EnemyTeamId를 생성한다', () => {
            // When
            const enemyTeamId = EnemyTeamId.create(validUuid);

            // Then
            expect(enemyTeamId).toBeInstanceOf(EnemyTeamId);
            expect(enemyTeamId.toString()).toBe(validUuid);
        });

        it('빈 문자열은 에러를 던진다', () => {
            // When & Then
            expect(() => EnemyTeamId.create('')).toThrow(
                EntityIdBlankException
            );
        });

        it('공백만 있는 문자열은 에러를 던진다', () => {
            // When & Then
            expect(() => EnemyTeamId.create('   ')).toThrow(
                EntityIdBlankException
            );
        });

        it('잘못된 UUID 형식은 에러를 던진다', () => {
            // When & Then
            expect(() => EnemyTeamId.create('invalid-uuid')).toThrow(
                InvalidEntityIdException
            );
            expect(() => EnemyTeamId.create('123456')).toThrow(
                InvalidEntityIdException
            );
        });

        it('UUID v1 형식은 에러를 던진다', () => {
            const uuidV1 = '550e8400-e29b-11d4-a716-446655440000';

            // When & Then
            expect(() => EnemyTeamId.create(uuidV1)).toThrow(
                InvalidEntityIdException
            );
        });
    });

    describe('reconstruct', () => {
        it('재생성되는 값을 그대로 신뢰하여 유효성 검사 없이 생성된다.', () => {
            // given
            const value = '잘못된 값';

            // when
            const id = EnemyTeamId.reconstruct(value);

            // then
            expect(id.toString()).toEqual(value);
        });
    });

    describe('equals', () => {
        it('같은 값을 가진 EnemyTeamId는 동등하다', () => {
            // Given
            const enemyTeamId1 = EnemyTeamId.create(validUuid);
            const enemyTeamId2 = EnemyTeamId.create(validUuid);

            // When & Then
            expect(enemyTeamId1.equals(enemyTeamId2)).toBe(true);
        });

        it('다른 값을 가진 EnemyTeamId는 동등하지 않다', () => {
            // Given
            const enemyTeamId1 = EnemyTeamId.create(
                '550e8400-e29b-41d4-a716-446655440000'
            );
            const enemyTeamId2 = EnemyTeamId.create(
                '660e8400-e29b-41d4-a716-446655440000'
            );

            // When & Then
            expect(enemyTeamId1.equals(enemyTeamId2)).toBe(false);
        });

        it('EnemyTeamId가 아닌 객체는 동등하지 않다', () => {
            // Given
            const enemyTeamId = EnemyTeamId.create(validUuid);
            const notEnemyTeamId = { value: validUuid } as never;

            // When & Then
            expect(enemyTeamId.equals(notEnemyTeamId)).toBe(false);
        });
    });

    describe('toString', () => {
        it('원시 값을 반환한다', () => {
            // Given
            const enemyTeamId = EnemyTeamId.create(validUuid);

            // When
            const result = enemyTeamId.toString();

            // Then
            expect(result).toBe(validUuid);
        });
    });

    describe('toJSON', () => {
        it('JSON 직렬화 시 원시 값을 반환한다', () => {
            // Given
            const enemyTeamId = EnemyTeamId.create(validUuid);

            // When
            const result = JSON.stringify({ enemyTeamId });

            // Then
            expect(result).toBe(`{"enemyTeamId":"${validUuid}"}`);
        });
    });
});
