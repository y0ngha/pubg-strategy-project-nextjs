import { Position } from '@domain/strategy/value-objects/position';
import { AirplanePath } from '@domain/strategy/entities/airplane-path.entity';
import { AirplanePathCreateDuplicatePositionException } from '@domain/strategy/exceptions/strategy.exceptions';

describe('AirplanePath', () => {
    describe('Create', () => {
        it('Airplane을 생성한다.', () => {
            // given
            const startPosition = Position.create(10, 20);
            const endPosition = Position.create(1000, 2000);

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
            ).toThrow(new AirplanePathCreateDuplicatePositionException());
        });
    });

    describe('Delete', () => {
        it('만들어져있는 객체를 삭제처리한다.', () => {
            // given
            const startPosition = Position.create(10, 20);
            const endPosition = Position.create(1000, 2000);
            const airplanePath = AirplanePath.create(
                startPosition,
                endPosition
            );

            // when
            airplanePath.delete();

            // then
            expect(airplanePath.isDeleted).toBeTruthy();
        });
    });
});
