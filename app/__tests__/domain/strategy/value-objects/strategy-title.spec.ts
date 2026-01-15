import { StrategyTitleBlankException } from '@domain/strategy/exceptions/strategy.exceptions';
import { StrategyTitle } from '@domain/strategy/value-objects/strategy-title';

describe('StrategyTitle', () => {
    const validStrategyTitle = '태그';

    describe('create', () => {
        it('유효한 값으로 StrategyTitle를 생성한다', () => {
            // When
            const strategyTitle = StrategyTitle.create(validStrategyTitle);

            // Then
            expect(strategyTitle).toBeInstanceOf(StrategyTitle);
            expect(strategyTitle.toString()).toBe(validStrategyTitle);
        });

        it('StrategyTitle를 생성할 때 양 옆 공백은 삭제되고 생성한다', () => {
            // Given
            const content = ' 태 그 ';

            // When
            const strategyTitle = StrategyTitle.create(content);

            // Then
            expect(strategyTitle).toBeInstanceOf(StrategyTitle);
            expect(strategyTitle.toString()).toBe(content.trim());
        });

        it('빈 문자열은 에러를 던진다', () => {
            // When & Then
            expect(() => StrategyTitle.create('')).toThrow(
                StrategyTitleBlankException
            );
        });

        it('공백만 있는 문자열은 에러를 던진다', () => {
            // When & Then
            expect(() => StrategyTitle.create('   ')).toThrow(
                StrategyTitleBlankException
            );
        });
    });

    describe('equals', () => {
        it('같은 값을 가진 StrategyTitle는 동등하다', () => {
            // Given
            const strategyTitle1 = StrategyTitle.create(validStrategyTitle);
            const strategyTitle2 = StrategyTitle.create(validStrategyTitle);

            // When & Then
            expect(strategyTitle1.equals(strategyTitle2)).toBe(true);
        });

        it('다른 값을 가진 StrategyTitle는 동등하지 않다', () => {
            // Given
            const strategyTitle1 = StrategyTitle.create('A');
            const strategyTitle2 = StrategyTitle.create('B');

            // When & Then
            expect(strategyTitle1.equals(strategyTitle2)).toBe(false);
        });

        it('StrategyTitle가 아닌 객체는 동등하지 않다', () => {
            // Given
            const strategyTitle = StrategyTitle.create(validStrategyTitle);
            const notStrategyTitle = { label: 'A' } as never;

            // When & Then
            expect(strategyTitle.equals(notStrategyTitle)).toBe(false);
        });
    });

    describe('toString', () => {
        it('원시 값을 반환한다', () => {
            // Given
            const strategyTitle = StrategyTitle.create(validStrategyTitle);

            // When
            const result = strategyTitle.toString();

            // Then
            expect(result).toBe(validStrategyTitle);
        });
    });

    describe('toJSON', () => {
        it('JSON 직렬화 시 원시 값을 반환한다', () => {
            // Given
            const strategyTitle = StrategyTitle.create(validStrategyTitle);

            // When
            const result = JSON.stringify({ strategyTitle });

            // Then
            expect(result).toBe(`{"strategyTitle":"${validStrategyTitle}"}`);
        });
    });
});
