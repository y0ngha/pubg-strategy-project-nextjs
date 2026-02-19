import { Position } from '@domain/strategy/value-objects/position';
import { StrategyId } from '@domain/strategy/value-objects/strategy-id';
import { CreateEnemyTeamCommand } from '@domain/strategy/commands/enemy-team/create-enemy-team.command';
import { TeamLabel } from '@domain/strategy/value-objects/team-label';

describe('CreateEnemyTeamCommand', () => {
    it('적 팀 생성 Command가 생성된다.', () => {
        // given
        const strategyId = StrategyId.generate();
        const teamLabel = TeamLabel.create('A');
        const position = Position.create(10, 10);

        //when
        const command = CreateEnemyTeamCommand.create(
            strategyId,
            teamLabel,
            position
        );

        // then
        expect(command).toBeInstanceOf(CreateEnemyTeamCommand);
        expect(command.strategyId).toEqual(strategyId);
        expect(command.teamLabel).toEqual(teamLabel);
        expect(command.position).toEqual(position);
    });
});
