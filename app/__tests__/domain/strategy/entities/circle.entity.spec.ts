import { Position } from '@domain/strategy/value-objects/position';
import { Circle } from '@domain/strategy/entities/circle.entity';
import {
    DeletedCircleException,
    InvalidCirclePhaseException,
    SamePositionException,
} from '@domain/strategy/exceptions/strategy.exceptions';
import { CircleId } from '@domain/strategy/value-objects/circle-id';

describe('Circle', () => {
    const centerPosition = Position.create(100, 100);
    describe('Create', () => {
        it('자기장 Phase가 1 - 8사이인 경우 생성된다.', () => {
            // given
            const phases = [1, 2, 3, 4, 5, 6, 7, 8];

            // when
            const circles = phases.map(phase =>
                Circle.create(centerPosition, phase)
            );

            // then
            circles.forEach((circle, index) => {
                expect(circle).toBeInstanceOf(Circle);
                expect(circle.phase).toBe(phases[index]);
            });
        });

        it('자기장 Phase가 1미만인 경우 에러를 던진다.', () => {
            // given
            const phase = 0;

            // when & then
            expect(() => Circle.create(centerPosition, phase)).toThrow(
                InvalidCirclePhaseException
            );
        });

        it('자기장 Phase가 8초과인 경우 에러를 던진다.', () => {
            // given
            const phase = 9;
            // when & then
            expect(() => Circle.create(centerPosition, phase)).toThrow(
                InvalidCirclePhaseException
            );
        });
    });

    describe('Reconstruct', () => {
        const id = CircleId.generate();
        const centerPosition = Position.create(100, 100);
        const createdAt = new Date();
        const updatedAt = new Date();

        it('자기장 Phase가 1 - 8사이인 경우 재생성된다.', () => {
            // given
            const phases = [1, 2, 3, 4, 5, 6, 7, 8];

            // when
            const circles = phases.map(phase =>
                Circle.reconstruct(
                    id,
                    centerPosition,
                    phase,
                    createdAt,
                    updatedAt
                )
            );

            // then
            circles.forEach((circle, index) => {
                expect(circle).toBeInstanceOf(Circle);
                expect(circle.phase).toBe(phases[index]);
                expect(circle.id).toBe(id);
            });
        });

        it('자기장 Phase가 1미만인 경우 에러를 던진다.', () => {
            // given
            const phase = 0;

            // when & then
            expect(() =>
                Circle.reconstruct(
                    id,
                    centerPosition,
                    phase,
                    createdAt,
                    updatedAt
                )
            ).toThrow(InvalidCirclePhaseException);
        });

        it('자기장 Phase가 8초과인 경우 에러를 던진다.', () => {
            // given
            const phase = 9;
            // when & then
            expect(() =>
                Circle.reconstruct(
                    id,
                    centerPosition,
                    phase,
                    createdAt,
                    updatedAt
                )
            ).toThrow(InvalidCirclePhaseException);
        });
    });

    describe('UpdateCenterPosition', () => {
        it('삭제되지 않은 자기장 객체라면, 포지션은 업데이트 된다.', () => {
            // given

            const circle = Circle.create(centerPosition, 1);
            const newCenterPosition = Position.create(300, 300);
            const oldUpdatedAt = circle.updatedAt;

            jest.useFakeTimers();
            jest.advanceTimersByTime(1000);

            // when
            circle.updateCenterPosition(newCenterPosition);

            // then
            expect(circle.centerPosition).toEqual(newCenterPosition);
            expect(circle.updatedAt.getTime()).toBeGreaterThan(
                oldUpdatedAt.getTime()
            );
        });

        it('삭제된 자기장 객체라면, 포지션 업데이트시 에러를 던진다.', () => {
            // given
            const circle = Circle.create(centerPosition, 1);
            const newCenterPosition = Position.create(300, 300);
            circle.delete();

            // when & then
            expect(() =>
                circle.updateCenterPosition(newCenterPosition)
            ).toThrow(DeletedCircleException);
        });

        it('삭제되지 않은 자기장 객체이고, 똑같은 포지션으로 업데이트시 에러를 던진다.', () => {
            // given
            const circle = Circle.create(centerPosition, 1);

            // when & then
            expect(() => circle.updateCenterPosition(centerPosition)).toThrow(
                SamePositionException
            );
        });
    });

    describe('UpdatePhase', () => {
        it('삭제되지 않은 자기장 객체라면, 페이즈가 유효한 경우 업데이트 된다.', () => {
            // given
            const circle = Circle.create(centerPosition, 1);
            const newPhase = 8;
            const oldUpdatedAt = circle.updatedAt;

            jest.useFakeTimers();
            jest.advanceTimersByTime(1000);

            // when
            circle.updatePhase(newPhase);

            // then
            expect(circle.phase).toBe(newPhase);
            expect(circle.updatedAt.getTime()).toBeGreaterThan(
                oldUpdatedAt.getTime()
            );
        });

        it('삭제된 자기장 객체라면, 페이즈 업데이트시 에러를 던진다.', () => {
            // given
            const circle = Circle.create(centerPosition, 1);
            const newPhase = 2;
            circle.delete();

            // when & then
            expect(() => circle.updatePhase(newPhase)).toThrow(
                DeletedCircleException
            );
        });

        it('삭제되지 않은 자기장 객체이고, 페이즈를 1 미만으로 업데이트 하는 경우 에러를 던진다.', () => {
            // given
            const circle = Circle.create(centerPosition, 1);
            const newPhase = 0;

            // when & then
            expect(() => circle.updatePhase(newPhase)).toThrow(
                InvalidCirclePhaseException
            );
        });

        it('삭제되지 않은 자기장 객체이고, 페이즈를 8 초과로 업데이트 하는 경우 에러를 던진다.', () => {
            // given
            const circle = Circle.create(centerPosition, 1);
            const newPhase = 9;

            // when & then
            expect(() => circle.updatePhase(newPhase)).toThrow(
                InvalidCirclePhaseException
            );
        });
    });

    describe('Delete', () => {
        it('삭제되지 않은 자기장 객체라면, 자기장은 삭제 된다.', () => {
            // given
            const circle = Circle.create(centerPosition, 1);

            // when
            circle.delete();

            // then
            expect(circle.isDeleted).toBeTruthy();
        });

        it('삭제된 자기장 객체라면, 삭제시 에러를 던진다.', () => {
            // given
            const circle = Circle.create(centerPosition, 1);
            circle.delete();

            // when & then
            expect(() => circle.delete()).toThrow(DeletedCircleException);
        });
    });
});
