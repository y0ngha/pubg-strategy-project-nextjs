import { TeamPlayerId } from '@domain/strategy/value-objects/team-player-id';
import {
    EntityIdBlankException,
    InvalidEntityIdException,
} from '@domain/shared/exceptions/entity-id.exceptions';

describe('TeamPlayerId', () => {
    const validUuid = '550e8400-e29b-41d4-a716-446655440000';

    describe('create', () => {
        it('유효한 UUID로 TeamPlayerId를 생성한다', () => {
            // When
            const teamPlayerId = TeamPlayerId.create(validUuid);

            // Then
            expect(teamPlayerId).toBeInstanceOf(TeamPlayerId);
            expect(teamPlayerId.toString()).toBe(validUuid);
        });

        it('빈 문자열은 에러를 던진다', () => {
            // When & Then
            expect(() => TeamPlayerId.create('')).toThrow(
                EntityIdBlankException
            );
        });

        it('공백만 있는 문자열은 에러를 던진다', () => {
            // When & Then
            expect(() => TeamPlayerId.create('   ')).toThrow(
                EntityIdBlankException
            );
        });

        it('잘못된 UUID 형식은 에러를 던진다', () => {
            // When & Then
            expect(() => TeamPlayerId.create('invalid-uuid')).toThrow(
                InvalidEntityIdException
            );
            expect(() => TeamPlayerId.create('123456')).toThrow(
                InvalidEntityIdException
            );
        });

        it('UUID v1 형식은 에러를 던진다', () => {
            const uuidV1 = '550e8400-e29b-11d4-a716-446655440000';

            // When & Then
            expect(() => TeamPlayerId.create(uuidV1)).toThrow(
                InvalidEntityIdException
            );
        });
    });

    describe('reconstruct', () => {
        it('재생성되는 값을 그대로 신뢰하여 유효성 검사 없이 생성된다.', () => {
            // given
            const value = '잘못된 값';

            // when
            const id = TeamPlayerId.reconstruct(value);

            // then
            expect(id.toString()).toEqual(value);
        });
    });

    describe('equals', () => {
        it('같은 값을 가진 TeamPlayerId는 동등하다', () => {
            // Given
            const teamPlayerId1 = TeamPlayerId.create(validUuid);
            const teamPlayerId2 = TeamPlayerId.create(validUuid);

            // When & Then
            expect(teamPlayerId1.equals(teamPlayerId2)).toBe(true);
        });

        it('다른 값을 가진 TeamPlayerId는 동등하지 않다', () => {
            // Given
            const teamPlayerId1 = TeamPlayerId.create(
                '550e8400-e29b-41d4-a716-446655440000'
            );
            const teamPlayerId2 = TeamPlayerId.create(
                '660e8400-e29b-41d4-a716-446655440000'
            );

            // When & Then
            expect(teamPlayerId1.equals(teamPlayerId2)).toBe(false);
        });

        it('TeamPlayerId가 아닌 객체는 동등하지 않다', () => {
            // Given
            const teamPlayerId = TeamPlayerId.create(validUuid);
            const notTeamPlayerId = { value: validUuid } as never;

            // When & Then
            expect(teamPlayerId.equals(notTeamPlayerId)).toBe(false);
        });
    });

    describe('toString', () => {
        it('원시 값을 반환한다', () => {
            // Given
            const teamPlayerId = TeamPlayerId.create(validUuid);

            // When
            const result = teamPlayerId.toString();

            // Then
            expect(result).toBe(validUuid);
        });
    });

    describe('toJSON', () => {
        it('JSON 직렬화 시 원시 값을 반환한다', () => {
            // Given
            const teamPlayerId = TeamPlayerId.create(validUuid);

            // When
            const result = JSON.stringify({ teamPlayerId });

            // Then
            expect(result).toBe(`{"teamPlayerId":"${validUuid}"}`);
        });
    });
});
