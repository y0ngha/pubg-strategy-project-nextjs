import { StrategyId } from '@domain/strategy/value-objects/strategy-id';
import { TeamPlayerId } from '@domain/strategy/value-objects/team-player-id';
import { UpdateTeamPlayerPositionCommand } from '@domain/strategy/commands/team-player/update-team-player-position.command';
import { Position } from '@domain/strategy/value-objects/position';

describe('UpdateTeamPlayerPositionCommand', () => {
    it('팀 플레이어 위치 수정 Command가 생성된다.', () => {
        // given
        const strategyId = StrategyId.generate();
        const teamPlayerId = TeamPlayerId.generate();
        const position = Position.create(10, 10);

        //when
        const command = UpdateTeamPlayerPositionCommand.create(
            strategyId,
            teamPlayerId,
            position
        );

        // then
        expect(command).toBeInstanceOf(UpdateTeamPlayerPositionCommand);
        expect(command.strategyId).toEqual(strategyId);
        expect(command.teamPlayerId).toEqual(teamPlayerId);
        expect(command.position).toEqual(position);
    });
});
