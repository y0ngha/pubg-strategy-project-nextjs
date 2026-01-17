import { Position } from '@domain/strategy/value-objects/position';
import { TeamLabel } from '@domain/strategy/value-objects/team-label';
import { EnemyTeam } from '@domain/strategy/entities/enemy-team.entity';
import { EnemyTeamId } from '@domain/strategy/value-objects/enemy-team-id';
import { DeletedEnemyTeamException } from '@domain/strategy/exceptions/strategy.exceptions';

describe('EnemyTeam', () => {
    const teamLabel = TeamLabel.create('A');
    const position = Position.create(10, 20);

    beforeEach(() => {
        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    describe('Create', () => {
        it('정상적인 팀 라벨과, 포지션으로 생성할 수 있다.', () => {
            // when
            const enemyTeam = EnemyTeam.create(teamLabel, position);

            // then
            expect(enemyTeam.teamLabel).toEqual(teamLabel);
            expect(enemyTeam.position).toEqual(position);
        });
    });

    describe('Reconstruct', () => {
        it('정상적인 팀 라벨과, 포지션으로 재생성할 수 있다.', () => {
            // given
            const id = EnemyTeamId.generate();

            // when
            const enemyTeam = EnemyTeam.reconstruct(
                id,
                teamLabel,
                position,
                new Date(),
                new Date()
            );

            // then
            expect(enemyTeam.id).toBe(id);
            expect(enemyTeam.teamLabel).toEqual(teamLabel);
            expect(enemyTeam.position).toEqual(position);
        });
    });

    describe('UpdateTeamLabel', () => {
        it('적 팀 객체가 삭제되어 있지 않다면, 팀 라벨 업데이트시 업데이트 된다.', () => {
            //given
            const enemyTeam = EnemyTeam.create(teamLabel, position);
            const newTeamLabel = TeamLabel.create('B');
            const oldUpdatedAt = enemyTeam.updatedAt;

            jest.advanceTimersByTime(1000);

            // when
            enemyTeam.updateTeamLabel(newTeamLabel);

            // then
            expect(enemyTeam.teamLabel).toEqual(newTeamLabel);
            expect(enemyTeam.updatedAt.getTime()).toBeGreaterThan(
                oldUpdatedAt.getTime()
            );
        });

        it('적 팀 객체가 삭제되어 있지 않고, 동일한 팀 라벨로 업데이트시 무시된다.', () => {
            //given
            const enemyTeam = EnemyTeam.create(teamLabel, position);
            const oldUpdatedAt = enemyTeam.updatedAt;
            jest.advanceTimersByTime(1000);

            // when
            enemyTeam.updateTeamLabel(teamLabel);

            // then
            expect(enemyTeam.teamLabel).toEqual(teamLabel);
            expect(enemyTeam.updatedAt.getTime()).toEqual(
                oldUpdatedAt.getTime()
            );
        });

        it('적 팀 객체가 삭제되어 있다면, 팀 라벨 업데이트시 에러를 던진다.', () => {
            //given
            const enemyTeam = EnemyTeam.create(teamLabel, position);
            const newTeamLabel = TeamLabel.create('C');
            enemyTeam.delete();

            // when & then
            expect(() => enemyTeam.updateTeamLabel(newTeamLabel)).toThrow(
                DeletedEnemyTeamException
            );
        });
    });

    describe('UpdatePosition', () => {
        it('적 팀 객체가 삭제되어 있지 않다면, 포지션 업데이트시 업데이트 된다.', () => {
            //given
            const enemyTeam = EnemyTeam.create(teamLabel, position);
            const newPosition = Position.create(300, 200);
            const oldUpdatedAt = enemyTeam.updatedAt;

            jest.advanceTimersByTime(1000);

            // when
            enemyTeam.updatePosition(newPosition);

            // then
            expect(enemyTeam.position).toEqual(newPosition);
            expect(enemyTeam.updatedAt.getTime()).toBeGreaterThan(
                oldUpdatedAt.getTime()
            );
        });

        it('적 팀 객체가 삭제되어 있지 않고, 동일한 포지션으로 업데이트시 무시된다.', () => {
            //given
            const enemyTeam = EnemyTeam.create(teamLabel, position);
            const oldUpdatedAt = enemyTeam.updatedAt;

            // when
            enemyTeam.updatePosition(position);

            // then
            expect(enemyTeam.updatedAt.getTime()).toEqual(
                oldUpdatedAt.getTime()
            );
            expect(enemyTeam.position).toEqual(position);
        });

        it('적 팀 객체가 삭제되어 있다면, 팀 포지션 업데이트시 에러를 던진다.', () => {
            //given
            const enemyTeam = EnemyTeam.create(teamLabel, position);
            const newPosition = Position.create(300, 200);
            enemyTeam.delete();

            // when & then
            expect(() => enemyTeam.updatePosition(newPosition)).toThrow(
                DeletedEnemyTeamException
            );
        });
    });

    describe('Delete', () => {
        it('적 팀 객체가 삭제되어 있지 않다면, 삭제시 삭제 된다.', () => {
            //given
            const enemyTeam = EnemyTeam.create(teamLabel, position);

            // when
            enemyTeam.delete();

            // then
            expect(enemyTeam.isDeleted).toBeTruthy();
        });

        it('적 팀 객체가 삭제되어 있다면, 삭제시 에러를 던진다.', () => {
            //given
            const enemyTeam = EnemyTeam.create(teamLabel, position);
            enemyTeam.delete();

            // when & then
            expect(() => enemyTeam.delete()).toThrow(DeletedEnemyTeamException);
        });
    });
});
