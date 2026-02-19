import { Position } from '@domain/strategy/value-objects/position';
import { StrategyId } from '@domain/strategy/value-objects/strategy-id';
import { CreateTeamPlayerCommand } from '@domain/strategy/commands/team-player/create-team-player.command';

describe('CreateTeamPlayerCommand', () => {
    it('팀 플레이어 생성 Command가 생성된다.', () => {
        // given
        const strategyId = StrategyId.generate();
        const position = Position.create(10, 10);

        //when
        const command = CreateTeamPlayerCommand.create(strategyId, position);

        // then
        expect(command).toBeInstanceOf(CreateTeamPlayerCommand);
        expect(command.strategyId).toEqual(strategyId);
        expect(command.position).toEqual(position);
    });
});
