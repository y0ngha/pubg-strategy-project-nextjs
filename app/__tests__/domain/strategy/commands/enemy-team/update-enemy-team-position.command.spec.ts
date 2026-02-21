import { StrategyId } from '@domain/strategy/value-objects/strategy-id';
import { EnemyTeamId } from '@domain/strategy/value-objects/enemy-team-id';
import { Position } from '@domain/strategy/value-objects/position';
import { UpdateEnemyTeamPositionCommand } from '@domain/strategy/commands/enemy-team/update-enemy-team-position.command';

describe('UpdateEnemyTeamPositionCommand', () => {
    it('적 팀 위치 수정 Command가 생성된다.', () => {
        // given
        const strategyId = StrategyId.generate();
        const enemyTeamId = EnemyTeamId.generate();
        const position = Position.create(10, 10);

        //when
        const command = UpdateEnemyTeamPositionCommand.create(
            strategyId,
            enemyTeamId,
            position
        );

        // then
        expect(command).toBeInstanceOf(UpdateEnemyTeamPositionCommand);
        expect(command.strategyId).toEqual(strategyId);
        expect(command.enemyTeamId).toEqual(enemyTeamId);
        expect(command.position).toEqual(position);
    });
});
