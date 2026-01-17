import { Position } from '@domain/strategy/value-objects/position';
import { Waypoint } from '@domain/strategy/entities/waypoint.entity';
import {
    DeletedWaypointException,
    WaypointCreateDuplicatePositionException,
    WaypointPositionLimitExceededException,
} from '@domain/strategy/exceptions/strategy.exceptions';

describe('Waypoint', () => {
    beforeEach(() => {
        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.useRealTimers();
    });

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
            expect(waypoint.positions).not.toBe(positions);
            expect(waypoint.positions).toEqual(positions);
            expect(waypoint.isDeleted).toBeFalsy();
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
                new WaypointPositionLimitExceededException()
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

    describe('UpdatePositions', () => {
        it('기존과 다른 포지션이라면, 업데이트 된다.', () => {
            // given
            const initialPositions = [
                Position.create(1, 3),
                Position.create(1, 7),
                Position.create(1, 10),
                Position.create(1, 20),
                Position.create(1, 30),
                Position.create(1, 40),
            ];
            const waypoint = Waypoint.create(initialPositions);

            const newPositions = [
                Position.create(1, 3),
                Position.create(1, 7),
                Position.create(1, 10),
                Position.create(1, 20),
                Position.create(1, 30),
            ];
            const oldUpdatedAt = waypoint.updatedAt;

            jest.advanceTimersByTime(1000);

            // when
            waypoint.updatePositions(newPositions);

            // then
            expect(waypoint.positions).toEqual(newPositions);
            expect(waypoint.updatedAt.getTime()).toBeGreaterThan(
                oldUpdatedAt.getTime()
            );
        });
        it('기존과 같은 포지션이라면, 무시 된다.', () => {
            // given
            const initialPositions = [
                Position.create(1, 3),
                Position.create(1, 7),
                Position.create(1, 10),
                Position.create(1, 20),
                Position.create(1, 30),
                Position.create(1, 40),
            ];
            const waypoint = Waypoint.create(initialPositions);
            const oldUpdatedAt = waypoint.updatedAt;

            jest.advanceTimersByTime(1000);

            // when
            waypoint.updatePositions(initialPositions);

            // then
            expect(waypoint.positions).toEqual(initialPositions);
            expect(waypoint.updatedAt.getTime()).toEqual(
                oldUpdatedAt.getTime()
            );
        });

        it('이미 삭제된 객체라면, 에러를 던진다.', () => {
            // give
            const positions = [
                Position.create(1, 3),
                Position.create(1, 7),
                Position.create(1, 10),
                Position.create(1, 20),
                Position.create(1, 30),
                Position.create(1, 40),
            ];
            const waypoint = Waypoint.create(positions);
            waypoint.delete();

            // when & then
            expect(() => waypoint.updatePositions(positions)).toThrow(
                DeletedWaypointException
            );
        });
    });

    describe('Delete', () => {
        it('만들어져있는 객체를 삭제처리한다.', () => {
            // given
            const positions = [
                Position.create(1, 3),
                Position.create(1, 7),
                Position.create(1, 10),
                Position.create(1, 20),
                Position.create(1, 30),
                Position.create(1, 40),
            ];
            const waypoint = Waypoint.create(positions);

            // when
            waypoint.delete();

            // then
            expect(waypoint.isDeleted).toBeTruthy();
        });

        it('이미 삭제된 객체라면, 에러를 던진다.', () => {
            // give
            const positions = [
                Position.create(1, 3),
                Position.create(1, 7),
                Position.create(1, 10),
                Position.create(1, 20),
                Position.create(1, 30),
                Position.create(1, 40),
            ];
            const waypoint = Waypoint.create(positions);
            waypoint.delete();

            // when & then
            expect(() => waypoint.delete()).toThrow(DeletedWaypointException);
        });
    });
});
