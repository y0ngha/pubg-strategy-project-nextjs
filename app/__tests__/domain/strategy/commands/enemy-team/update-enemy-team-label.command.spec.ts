import { StrategyId } from '@domain/strategy/value-objects/strategy-id';
import { EnemyTeamId } from '@domain/strategy/value-objects/enemy-team-id';
import { TeamLabel } from '@domain/strategy/value-objects/team-label';
import { UpdateEnemyTeamLabelCommand } from '@domain/strategy/commands/enemy-team/update-enemy-team-label.command';

describe('UpdateEnemyTeamLabelCommand', () => {
    it('적 팀 라벨 수정 Command가 생성된다.', () => {
        // given
        const strategyId = StrategyId.generate();
        const enemyTeamId = EnemyTeamId.generate();
        const teamLabel = TeamLabel.create('A');

        //when
        const command = UpdateEnemyTeamLabelCommand.create(
            strategyId,
            enemyTeamId,
            teamLabel
        );

        // then
        expect(command).toBeInstanceOf(UpdateEnemyTeamLabelCommand);
        expect(command.strategyId).toEqual(strategyId);
        expect(command.enemyTeamId).toEqual(enemyTeamId);
        expect(command.teamLabel).toEqual(teamLabel);
    });
});
