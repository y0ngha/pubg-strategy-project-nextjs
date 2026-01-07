import { Position } from '@domain/strategy/value-objects/position';
import { Marker } from '@domain/strategy/entities/marker.entity';

describe('Marker', () => {
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

    describe('Update', () => {
        it('포지션을 똑같은 위치로 업데이트 하려 하고, 삭제된 상태가 아니라면 삭제 된다.', () => {
            // given
            const oldPosition = Position.create(10, 20);
            const newPosition = Position.create(10, 20);
            const marker = Marker.create(oldPosition);

            // when
            marker.update(newPosition);

            // then
            expect(marker.isDeleted).toBeTruthy();
            expect(marker.deletedAt).not.toBeNull();
        });

        it('포지션을 업데이트 하려 하고, 삭제된 상태라면 업데이트 된다.', () => {
            // given
            const oldPosition = Position.create(10, 20);
            const newPosition = Position.create(10, 20);
            const marker = Marker.create(oldPosition);
            marker.delete();

            // when
            marker.update(newPosition);

            // then
            expect(marker.isDeleted).toBeFalsy();
            expect(marker.deletedAt).toBeNull();
            expect(marker.position).toEqual(newPosition);
        });

        it('포지션을 다른 위치로 업데이트 하면 업데이트 된다.', () => {
            // given
            const oldPosition = Position.create(10, 20);
            const newPosition = Position.create(20, 20);
            const marker = Marker.create(oldPosition);

            // when
            marker.update(newPosition);

            // then
            expect(marker.isDeleted).toBeFalsy();
            expect(marker.position).toEqual(newPosition);
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
            expect(marker.deletedAt).not.toBeNull();
        });

        it('마커가 삭제 상태일 때 다시 삭제하면 변화되지 않는다.', () => {
            // given
            const position = Position.create(10, 20);
            const marker = Marker.create(position);
            marker.delete();
            const oldDeletedAt = marker.deletedAt;

            // when
            marker.delete();

            // then
            expect(marker.isDeleted).toBeTruthy();
            expect(marker.deletedAt).toBe(oldDeletedAt);
        });
    });
});
