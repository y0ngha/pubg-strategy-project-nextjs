import { StrategyId } from '@domain/strategy/value-objects/strategy-id';
import { EnemyTeamId } from '@domain/strategy/value-objects/enemy-team-id';
import { DeleteEnemyTeamCommand } from '@domain/strategy/commands/enemy-team/delete-enemy-team.command';

describe('DeleteEnemyTeamCommand', () => {
    it('적 팀 생성 Command가 생성된다.', () => {
        // given
        const strategyId = StrategyId.generate();
        const enemyTeamId = EnemyTeamId.generate();

        //when
        const command = DeleteEnemyTeamCommand.create(strategyId, enemyTeamId);

        // then
        expect(command).toBeInstanceOf(DeleteEnemyTeamCommand);
        expect(command.strategyId).toEqual(strategyId);
        expect(command.enemyTeamId).toEqual(enemyTeamId);
    });
});
