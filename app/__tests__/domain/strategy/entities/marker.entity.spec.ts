import { Position } from '@domain/strategy/value-objects/position';
import { Marker } from '@domain/strategy/entities/marker.entity';
import { DeletedMarkerException } from '@domain/strategy/exceptions/strategy.exceptions';
import { MarkerId } from '@domain/strategy/value-objects/marker-id';

describe('Marker', () => {
    beforeEach(() => {
        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    describe('Create', () => {
        it('포지션을 부여하면, 마커가 생겨난다.', () => {
            // given
            const position = Position.create(10, 20);

            // when
            const marker = Marker.create(position);

            // then
            expect(marker).toBeInstanceOf(Marker);
            expect(marker.position).toEqual(position);
        });
    });

    describe('Reconstruct', () => {
        it('재생성되는 값을 그대로 신뢰하여 유효성 검사 없이 생성된다.', () => {
            // given
            const id = MarkerId.generate();
            const position = Position.create(10, 10);
            const createdAt = new Date('2000-01-01');
            const updatedAt = new Date('2026-01-01');

            // when
            const marker = Marker.reconstruct(
                id,
                position,
                createdAt,
                updatedAt
            );

            // then
            expect(marker).toBeInstanceOf(Marker);
            expect(marker.id).toEqual(id);
            expect(marker.position).toEqual(position);
            expect(marker.createdAt).toEqual(createdAt);
            expect(marker.updatedAt).toEqual(updatedAt);
        });
    });

    describe('Update', () => {
        it('포지션을 다른 위치로 업데이트 하면 업데이트 된다.', () => {
            // given
            const oldPosition = Position.create(10, 20);
            const newPosition = Position.create(20, 20);
            const marker = Marker.create(oldPosition);

            const oldUpdatedAt = marker.updatedAt;

            jest.advanceTimersByTime(1000);

            // when
            marker.updatePosition(newPosition);

            // then
            expect(marker.position).toEqual(newPosition);
            expect(marker.updatedAt.getTime()).toBeGreaterThan(
                oldUpdatedAt.getTime()
            );
        });

        it('포지션을 같은 위치로 업데이트 하면 무시된다.', () => {
            // given
            const oldPosition = Position.create(10, 20);
            const marker = Marker.create(oldPosition);
            const oldUpdatedAt = marker.updatedAt;

            jest.advanceTimersByTime(1000);

            // when
            marker.updatePosition(oldPosition);

            // then
            expect(marker.position).toEqual(oldPosition);
            expect(marker.updatedAt.getTime()).toEqual(oldUpdatedAt.getTime());
        });

        it('이미 삭제된 객체라면, 에러를 던진다.', () => {
            // give
            const position = Position.create(10, 20);
            const newPosition = Position.create(10, 30);
            const marker = Marker.create(position);
            marker.delete();

            // when & then
            expect(() => marker.updatePosition(newPosition)).toThrow(
                DeletedMarkerException
            );
        });
    });

    describe('Delete', () => {
        it('마커를 삭제하면, 삭제된다.', () => {
            // given
            const position = Position.create(10, 20);
            const marker = Marker.create(position);

            // when
            marker.delete();

            // then
            expect(marker.isDeleted).toBeTruthy();
        });

        it('이미 삭제된 객체라면, 에러를 던진다.', () => {
            // give
            const position = Position.create(10, 20);
            const marker = Marker.create(position);
            marker.delete();

            // when & then
            expect(() => marker.delete()).toThrow(DeletedMarkerException);
        });
    });
});
