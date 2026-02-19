import { Position } from '@domain/strategy/value-objects/position';
import { TeamPlayerId } from '@domain/strategy/value-objects/team-player-id';
import { StrategyId } from '@domain/strategy/value-objects/strategy-id';
import { CreateWaypointCommand } from '@domain/strategy/commands/waypoint/create-waypoint.command';
import { WaypointPositions } from '@domain/strategy/value-objects/waypoint-positions';

describe('CreateWaypointCommand', () => {
    const strategyId = StrategyId.generate();
    const teamPlayerId = TeamPlayerId.generate();

    it('웨이포인트 생성 Command가 생성된다.', () => {
        // given
        const positions = WaypointPositions.create([Position.create(10, 10)]);

        //when
        const command = CreateWaypointCommand.create(
            strategyId,
            teamPlayerId,
            positions
        );

        // then
        expect(command).toBeInstanceOf(CreateWaypointCommand);
        expect(command.strategyId).toEqual(strategyId);
        expect(command.teamPlayerId).toEqual(teamPlayerId);
        expect(command.positions).toEqual(positions);
    });
});
