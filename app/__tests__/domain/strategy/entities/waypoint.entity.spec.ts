import { Position } from '@domain/strategy/value-objects/position';
import { Waypoint } from '@domain/strategy/entities/waypoint.entity';
import {
    WaypointCreateDuplicatePositionException,
    WaypointCreateTooManyPositionException,
} from '@domain/strategy/exceptions/strategy.exceptions';

describe('Waypoint', () => {
    describe('Create', () => {
        it('Waypoint를 생성한다.', () => {
            // given
            const positions = [
                Position.create(1, 3),
                Position.create(1, 7),
                Position.create(1, 10),
                Position.create(1, 20),
                Position.create(1, 30),
                Position.create(1, 40),
            ];

            // when
            const waypoint = Waypoint.create(positions);

            // then
            expect(waypoint.positions).toHaveLength(positions.length);
        });

        it('Waypoint가 7개 이상이면 에러를 던진다.', () => {
            // given
            const positions = [
                Position.create(1, 3),
                Position.create(1, 7),
                Position.create(1, 10),
                Position.create(1, 20),
                Position.create(1, 30),
                Position.create(1, 40),
                Position.create(1, 50),
            ];

            // when & then
            expect(() => Waypoint.create(positions)).toThrow(
                new WaypointCreateTooManyPositionException()
            );
        });

        it('Waypoint가 6개 이하인데 중복된 값이 있으면 에러를 던진다.', () => {
            // given
            const positions = [
                Position.create(1, 3),
                Position.create(1, 7),
                Position.create(1, 10),
                Position.create(1, 10),
                Position.create(1, 30),
                Position.create(1, 40),
            ];

            // when & then
            expect(() => Waypoint.create(positions)).toThrow(
                new WaypointCreateDuplicatePositionException()
            );
        });
    });
});
