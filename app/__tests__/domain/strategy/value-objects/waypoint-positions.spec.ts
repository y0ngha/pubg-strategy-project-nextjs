import { WaypointPositions } from '@domain/strategy/value-objects/waypoint-positions';
import { Position } from '@domain/strategy/value-objects/position';

describe('WaypointPositions', () => {
    describe('Create', () => {
        it('Position Array로 이루어진 WaypointPositions을 만든다.', () => {
            const positions = WaypointPositions.create([
                Position.create(10, 10),
                Position.create(20, 20),
            ]);

            expect(positions.values).toHaveLength(2);
            expect(positions.values).toEqual([
                Position.create(10, 10),
                Position.create(20, 20),
            ]);
        });
    });

    describe('Reconstruct', () => {
        it('Position Array로 WaypointPositions을 재생성한다.', () => {
            const positions = WaypointPositions.create([
                Position.create(10, 10),
                Position.create(20, 20),
            ]);

            expect(positions.values).toHaveLength(2);
            expect(positions.values).toEqual([
                Position.create(10, 10),
                Position.create(20, 20),
            ]);
        });
    });

    describe('equals', () => {
        it('같은 값을 가진 WaypointPositions은 동등하다', () => {
            // Given
            const position1 = WaypointPositions.create([
                Position.create(10, 20),
            ]);
            const position2 = WaypointPositions.create([
                Position.create(10, 20),
            ]);

            // When & Then
            expect(position1.equals(position2)).toBe(true);
        });

        it('다른 값을 가진 WaypointPositions은 동등하지 않다', () => {
            // Given
            const position1 = WaypointPositions.create([
                Position.create(10, 20),
            ]);
            const position2 = WaypointPositions.create([
                Position.create(30, 40),
            ]);

            // When & Then
            expect(position1.equals(position2)).toBe(false);
        });

        it('WaypointPositions가 아닌 객체는 동등하지 않다', () => {
            // Given
            const position = WaypointPositions.create([
                Position.create(10, 20),
            ]);
            const notWaypointPositions = [{ x: 10, y: 20 }] as never;

            // When & Then
            expect(position.equals(notWaypointPositions)).toBe(false);
        });
    });

    describe('toJSON', () => {
        it('JSON 직렬화 시 WaypointPositions 객체를 반환한다', () => {
            // Given
            const waypointPositions = WaypointPositions.create([
                Position.create(10, 20),
            ]);

            // When
            const result = JSON.stringify({ waypointPositions });

            // Then
            expect(result).toBe(`{"waypointPositions":[{"x":10,"y":20}]}`);
        });
    });
});
