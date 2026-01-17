import { Position } from '@domain/strategy/value-objects/position';
import { AirplanePath } from '@domain/strategy/entities/airplane-path.entity';
import {
    AirplanePathCreateDuplicatePositionException,
    DeletedAirplanePathException,
} from '@domain/strategy/exceptions/strategy.exceptions';
import { AirplanePathId } from '@domain/strategy/value-objects/airplane-path-id';

describe('AirplanePath', () => {
    const startPosition = Position.create(10, 20);
    const endPosition = Position.create(1000, 2000);

    describe('Create', () => {
        it('Airplane을 생성한다.', () => {
            // when
            const airplanePath = AirplanePath.create(
                startPosition,
                endPosition
            );

            // then
            expect(airplanePath.startPosition).toEqual(startPosition);
            expect(airplanePath.endPosition).toEqual(endPosition);
            expect(airplanePath.isDeleted).toBeFalsy();
        });

        it('Position이 서로 동일하면 에러를 던진다.', () => {
            // given
            const startPosition = Position.create(10, 20);
            const endPosition = Position.create(10, 20);

            // when & then
            expect(() =>
                AirplanePath.create(startPosition, endPosition)
            ).toThrow(AirplanePathCreateDuplicatePositionException);
        });
    });

    describe('Reconstruct', () => {
        it('재생성되는 값을 그대로 신뢰하여 유효성 검사 없이 생성된다.', () => {
            // given
            const id = AirplanePathId.generate();
            const startPosition = Position.create(10, 10);
            const endPosition = Position.create(10, 10);
            const createdAt = new Date('2000-01-01');
            const updatedAt = new Date('2026-01-01');

            // when
            const airplanePath = AirplanePath.reconstruct(
                id,
                startPosition,
                endPosition,
                createdAt,
                updatedAt
            );

            // then
            expect(airplanePath).toBeInstanceOf(AirplanePath);
            expect(airplanePath.id).toEqual(id);
            expect(airplanePath.startPosition).toEqual(startPosition);
            expect(airplanePath.endPosition).toEqual(endPosition);
            expect(airplanePath.createdAt).toEqual(createdAt);
            expect(airplanePath.updatedAt).toEqual(updatedAt);
        });
    });

    describe('UpdateStartPosition', () => {
        it('기존과 다른 포지션으로 업데이트 하면, 업데이트 된다.', () => {
            // given
            const airplanePath = AirplanePath.create(
                startPosition,
                endPosition
            );
            const oldUpdatedAt = airplanePath.updatedAt;
            const newPosition = Position.create(9999, 1000);
            jest.advanceTimersByTime(1000);

            // when
            airplanePath.updateStartPosition(newPosition);

            // then
            expect(airplanePath.startPosition).not.toEqual(startPosition);
            expect(airplanePath.startPosition).toEqual(newPosition);
            expect(airplanePath.updatedAt.getTime()).toBeGreaterThan(
                oldUpdatedAt.getTime()
            );
        });

        it('기존과 같은 포지션으로 업데이트 하면, 무시된다.', () => {
            // given
            const airplanePath = AirplanePath.create(
                startPosition,
                endPosition
            );
            const oldUpdatedAt = airplanePath.updatedAt;
            jest.advanceTimersByTime(1000);

            // when
            airplanePath.updateStartPosition(startPosition);

            // then
            expect(airplanePath.startPosition).toEqual(startPosition);
            expect(airplanePath.updatedAt.getTime()).toEqual(
                oldUpdatedAt.getTime()
            );
        });

        it('삭제된 비행기 동선 객체라면, 업데이트시 에러를 던진다.', () => {
            // given
            const airplanePath = AirplanePath.create(
                startPosition,
                endPosition
            );
            airplanePath.delete();
            const newPosition = Position.create(9999, 1000);

            // when & then
            expect(() => airplanePath.updateStartPosition(newPosition)).toThrow(
                DeletedAirplanePathException
            );
        });
    });

    describe('UpdateEndPosition', () => {
        it('기존과 다른 포지션으로 업데이트 하면, 업데이트 된다.', () => {
            // given
            const airplanePath = AirplanePath.create(
                startPosition,
                endPosition
            );
            const oldUpdatedAt = airplanePath.updatedAt;
            const newPosition = Position.create(9999, 1000);
            jest.advanceTimersByTime(1000);

            // when
            airplanePath.updateEndPosition(newPosition);

            // then
            expect(airplanePath.endPosition).not.toEqual(endPosition);
            expect(airplanePath.endPosition).toEqual(newPosition);
            expect(airplanePath.updatedAt.getTime()).toBeGreaterThan(
                oldUpdatedAt.getTime()
            );
        });

        it('기존과 같은 포지션으로 업데이트 하면, 무시된다.', () => {
            // given
            const airplanePath = AirplanePath.create(
                startPosition,
                endPosition
            );
            const oldUpdatedAt = airplanePath.updatedAt;
            jest.advanceTimersByTime(1000);

            // when
            airplanePath.updateEndPosition(endPosition);

            // then
            expect(airplanePath.endPosition).toEqual(endPosition);
            expect(airplanePath.updatedAt.getTime()).toEqual(
                oldUpdatedAt.getTime()
            );
        });

        it('삭제된 비행기 동선 객체라면, 업데이트시 에러를 던진다.', () => {
            // given
            const airplanePath = AirplanePath.create(
                startPosition,
                endPosition
            );
            airplanePath.delete();
            const newPosition = Position.create(9999, 1000);

            // when & then
            expect(() => airplanePath.updateEndPosition(newPosition)).toThrow(
                DeletedAirplanePathException
            );
        });
    });

    describe('Delete', () => {
        it('만들어져있는 객체를 삭제처리한다.', () => {
            // given
            const airplanePath = AirplanePath.create(
                startPosition,
                endPosition
            );

            // when
            airplanePath.delete();

            // then
            expect(airplanePath.isDeleted).toBeTruthy();
        });

        it('삭제된 비행기 동선 객체라면, 삭제시 에러를 던진다.', () => {
            // given
            const airplanePath = AirplanePath.create(
                startPosition,
                endPosition
            );
            airplanePath.delete();

            // when & then
            expect(() => airplanePath.delete()).toThrow(
                DeletedAirplanePathException
            );
        });
    });
});
