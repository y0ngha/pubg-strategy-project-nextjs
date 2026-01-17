import { Position } from '@domain/strategy/value-objects/position';
import { Circle } from '@domain/strategy/entities/circle.entity';
import { DeletedCircleException } from '@domain/strategy/exceptions/strategy.exceptions';
import { CircleId } from '@domain/strategy/value-objects/circle-id';
import { CirclePhase } from '@domain/strategy/value-objects/circle-phase';

describe('Circle', () => {
    const centerPosition = Position.create(100, 100);

    beforeEach(() => {
        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    describe('Create', () => {
        it('자기장이 생성된다.', () => {
            // given
            const phase = CirclePhase.create(1);

            // when
            const circle = Circle.create(centerPosition, phase);

            // then
            expect(circle).toBeInstanceOf(Circle);
            expect(circle.phase).toBe(phase);
        });
    });

    describe('Reconstruct', () => {
        const id = CircleId.generate();
        const centerPosition = Position.create(100, 100);
        const createdAt = new Date();
        const updatedAt = new Date();

        it('자기장이 재생성된다.', () => {
            // given
            const phase = CirclePhase.create(1);

            // when
            const circle = Circle.reconstruct(
                id,
                centerPosition,
                phase,
                createdAt,
                updatedAt
            );

            // then
            expect(circle).toBeInstanceOf(Circle);
            expect(circle.phase).toBe(phase);
            expect(circle.id).toBe(id);
        });
    });

    describe('UpdateCenterPosition', () => {
        it('삭제되지 않은 자기장 객체라면, 포지션은 업데이트 된다.', () => {
            // given
            const phase = CirclePhase.create(1);
            const circle = Circle.create(centerPosition, phase);
            const newCenterPosition = Position.create(300, 300);
            const oldUpdatedAt = circle.updatedAt;

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
            const phase = CirclePhase.create(1);
            const circle = Circle.create(centerPosition, phase);
            const newCenterPosition = Position.create(300, 300);
            circle.delete();

            // when & then
            expect(() =>
                circle.updateCenterPosition(newCenterPosition)
            ).toThrow(DeletedCircleException);
        });

        it('삭제되지 않은 자기장 객체이고, 똑같은 포지션으로 업데이트시 업데이트 되지 않는다.', () => {
            // given
            const phase = CirclePhase.create(1);
            const circle = Circle.create(centerPosition, phase);
            const oldUpdateAt = circle.updatedAt;
            const oldCenterPosition = circle.centerPosition;
            jest.advanceTimersByTime(1000);

            // when
            circle.updateCenterPosition(centerPosition);

            // then
            expect(circle.updatedAt.getTime()).toEqual(oldUpdateAt.getTime());
            expect(circle.centerPosition).toEqual(oldCenterPosition);
        });
    });

    describe('UpdatePhase', () => {
        it('삭제되지 않은 자기장 객체라면, 페이즈가 유효한 경우 업데이트 된다.', () => {
            // given
            const oldPhase = CirclePhase.create(1);
            const circle = Circle.create(centerPosition, oldPhase);
            const newPhase = CirclePhase.create(8);
            const oldUpdatedAt = circle.updatedAt;

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
            const oldPhase = CirclePhase.create(1);
            const circle = Circle.create(centerPosition, oldPhase);
            const newPhase = CirclePhase.create(2);
            circle.delete();

            // when & then
            expect(() => circle.updatePhase(newPhase)).toThrow(
                DeletedCircleException
            );
        });
    });

    describe('Delete', () => {
        const phase = CirclePhase.create(1);
        it('삭제되지 않은 자기장 객체라면, 자기장은 삭제 된다.', () => {
            // given
            const circle = Circle.create(centerPosition, phase);

            // when
            circle.delete();

            // then
            expect(circle.isDeleted).toBeTruthy();
        });

        it('삭제된 자기장 객체라면, 삭제시 에러를 던진다.', () => {
            // given
            const circle = Circle.create(centerPosition, phase);
            circle.delete();

            // when & then
            expect(() => circle.delete()).toThrow(DeletedCircleException);
        });
    });
});
