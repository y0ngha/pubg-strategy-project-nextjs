import { StrategyId } from '@domain/strategy/value-objects/strategy-id';
import { TeamPlayerId } from '@domain/strategy/value-objects/team-player-id';
import { DeleteTeamPlayerCommand } from '@domain/strategy/commands/team-player/delete-team-player.command';

describe('DeleteTeamPlayerCommand', () => {
    it('팀 플레이어 삭제 Command가 생성된다.', () => {
        // given
        const strategyId = StrategyId.generate();
        const teamPlayerId = TeamPlayerId.generate();

        //when
        const command = DeleteTeamPlayerCommand.create(
            strategyId,
            teamPlayerId
        );

        // then
        expect(command).toBeInstanceOf(DeleteTeamPlayerCommand);
        expect(command.strategyId).toEqual(strategyId);
        expect(command.teamPlayerId).toEqual(teamPlayerId);
    });
});
