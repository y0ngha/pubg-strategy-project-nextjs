import { Position } from '@domain/strategy/value-objects/position';
import { TeamPlayerId } from '@domain/strategy/value-objects/team-player-id';
import { StrategyId } from '@domain/strategy/value-objects/strategy-id';

import { UpdateWaypointPositionsCommand } from '@domain/strategy/commands/waypoint/update-waypoint-positions.command';
import { WaypointId } from '@domain/strategy/value-objects/waypoint-id';
import { WaypointPositions } from '@domain/strategy/value-objects/waypoint-positions';

describe('UpdateWaypointPositionsCommand', () => {
    const strategyId = StrategyId.generate();
    const teamPlayerId = TeamPlayerId.generate();
    const waypointId = WaypointId.generate();

    it('웨이포인트 수정 Command가 생성된다.', () => {
        // given
        const positions = WaypointPositions.create([Position.create(10, 10)]);

        //when
        const command = UpdateWaypointPositionsCommand.create(
            strategyId,
            teamPlayerId,
            waypointId,
            positions
        );

        // then
        expect(command).toBeInstanceOf(UpdateWaypointPositionsCommand);
        expect(command.strategyId).toEqual(strategyId);
        expect(command.teamPlayerId).toEqual(teamPlayerId);
        expect(command.positions).toEqual(positions);
    });
});
