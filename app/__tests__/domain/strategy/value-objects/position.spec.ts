import { Position } from '@domain/strategy/value-objects/position';

describe('Position', () => {
    describe('Create', () => {
        it('두개의 숫자로 Position을 만든다.', () => {
            const position = Position.create(10, 20);

            expect(position.x).toBe(10);
            expect(position.y).toBe(20);
        });
    });

    describe('equals', () => {
        it('같은 값을 가진 Positio은 동등하다', () => {
            // Given
            const position1 = Position.create(10, 20);
            const position2 = Position.create(10, 20);

            // When & Then
            expect(position1.equals(position2)).toBe(true);
        });

        it('다른 값을 가진 Position은 동등하지 않다', () => {
            // Given
            const position1 = Position.create(10, 20);
            const position2 = Position.create(30, 40);

            // When & Then
            expect(position1.equals(position2)).toBe(false);
        });

        it('Position가 아닌 객체는 동등하지 않다', () => {
            // Given
            const position = Position.create(10, 20);
            const notPosition = { x: 10, y: 20 } as never;

            // When & Then
            expect(position.equals(notPosition)).toBe(false);
        });
    });

    describe('toJSON', () => {
        it('JSON 직렬화 시 Position 객체를 반환한다', () => {
            // Given
            const position = Position.create(10, 20);

            // When
            const result = JSON.stringify({ position });

            // Then
            expect(result).toBe(`{"position":{"x":10,"y":20}}`);
        });
    });
});
