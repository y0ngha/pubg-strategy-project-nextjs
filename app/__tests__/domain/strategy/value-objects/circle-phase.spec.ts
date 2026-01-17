import { CirclePhase } from '@domain/strategy/value-objects/circle-phase';
import { InvalidCirclePhaseException } from '@domain/strategy/exceptions/strategy.exceptions';

describe('CirclePhase', () => {
    const validCirclePhase = 1;

    describe('create', () => {
        it('유효한 값으로 CirclePhase를 생성한다', () => {
            // When
            const circlePhase = CirclePhase.create(validCirclePhase);

            // Then
            expect(circlePhase).toBeInstanceOf(CirclePhase);
            expect(circlePhase.toString()).toBe(validCirclePhase);
        });

        it('CirclePhase를 1 미만, 8 초과로 생성하려 할 때 에러를 던진다.', () => {
            // When & Then
            expect(() => CirclePhase.create(0)).toThrow(
                InvalidCirclePhaseException
            );
            expect(() => CirclePhase.create(9)).toThrow(
                InvalidCirclePhaseException
            );
        });
    });

    describe('equals', () => {
        it('같은 값을 가진 CirclePhase는 동등하다', () => {
            // Given
            const circlePhase1 = CirclePhase.create(validCirclePhase);
            const circlePhase2 = CirclePhase.create(validCirclePhase);

            // When & Then
            expect(circlePhase1.equals(circlePhase2)).toBe(true);
        });

        it('다른 값을 가진 CirclePhase는 동등하지 않다', () => {
            // Given
            const circlePhase1 = CirclePhase.create(1);
            const circlePhase2 = CirclePhase.create(2);

            // When & Then
            expect(circlePhase1.equals(circlePhase2)).toBe(false);
        });

        it('CirclePhase가 아닌 객체는 동등하지 않다', () => {
            // Given
            const circlePhase = CirclePhase.create(validCirclePhase);
            const notCirclePhase = { value: validCirclePhase } as never;

            // When & Then
            expect(circlePhase.equals(notCirclePhase)).toBe(false);
        });
    });

    describe('toString', () => {
        it('원시 값을 반환한다', () => {
            // Given
            const circlePhase = CirclePhase.create(validCirclePhase);

            // When
            const result = circlePhase.toString();

            // Then
            expect(result).toBe(validCirclePhase);
        });
    });

    describe('toJSON', () => {
        it('JSON 직렬화 시 원시 값을 반환한다', () => {
            // Given
            const circlePhase = CirclePhase.create(validCirclePhase);

            // When
            const result = JSON.stringify({ circlePhase });

            // Then
            expect(result).toBe(`{"circlePhase":${validCirclePhase}}`);
        });
    });
});
