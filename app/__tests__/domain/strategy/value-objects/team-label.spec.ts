import { TeamLabel } from '@domain/strategy/value-objects/team-label';
import { InvalidTeamLabelException } from '@domain/strategy/exceptions/strategy.exceptions';

describe('TeamLabel', () => {
    const validTeamLabel = 'A';

    describe('create', () => {
        it('유효한 값으로 TeamLabel를 생성한다', () => {
            // When
            const teamLabel = TeamLabel.create(validTeamLabel);

            // Then
            expect(teamLabel).toBeInstanceOf(TeamLabel);
            expect(teamLabel.toString()).toBe(validTeamLabel);
        });

        it('빈 문자열은 에러를 던진다', () => {
            // When & Then
            expect(() => TeamLabel.create('')).toThrow(
                new InvalidTeamLabelException('')
            );
        });

        it('공백만 있는 문자열은 에러를 던진다', () => {
            // When & Then
            expect(() => TeamLabel.create('   ')).toThrow(
                new InvalidTeamLabelException('   ')
            );
        });

        it('잘못된 라벨 형식은 에러를 던진다', () => {
            // When & Then
            expect(() => TeamLabel.create('가')).toThrow(
                new InvalidTeamLabelException('가')
            );
            expect(() => TeamLabel.create('1')).toThrow(
                new InvalidTeamLabelException('1')
            );
            expect(() => TeamLabel.create('ABC')).toThrow(
                new InvalidTeamLabelException('ABC')
            );
        });
    });

    describe('equals', () => {
        it('같은 값을 가진 TeamLabel는 동등하다', () => {
            // Given
            const teamLabel1 = TeamLabel.create(validTeamLabel);
            const teamLabel2 = TeamLabel.create(validTeamLabel);

            // When & Then
            expect(teamLabel1.equals(teamLabel2)).toBe(true);
        });

        it('다른 값을 가진 TeamLabel는 동등하지 않다', () => {
            // Given
            const teamLabel1 = TeamLabel.create('A');
            const teamLabel2 = TeamLabel.create('B');

            // When & Then
            expect(teamLabel1.equals(teamLabel2)).toBe(false);
        });

        it('TeamLabel가 아닌 객체는 동등하지 않다', () => {
            // Given
            const teamLabel = TeamLabel.create(validTeamLabel);
            const notTeamLabel = { label: 'A' } as never;

            // When & Then
            expect(teamLabel.equals(notTeamLabel)).toBe(false);
        });
    });

    describe('toString', () => {
        it('원시 값을 반환한다', () => {
            // Given
            const teamLabel = TeamLabel.create(validTeamLabel);

            // When
            const result = teamLabel.toString();

            // Then
            expect(result).toBe(validTeamLabel);
        });
    });

    describe('toJSON', () => {
        it('JSON 직렬화 시 원시 값을 반환한다', () => {
            // Given
            const teamLabel = TeamLabel.create(validTeamLabel);

            // When
            const result = JSON.stringify({ teamLabel });

            // Then
            expect(result).toBe(`{"teamLabel":"${validTeamLabel}"}`);
        });
    });
});
