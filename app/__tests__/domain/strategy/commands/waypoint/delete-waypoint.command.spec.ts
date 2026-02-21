import { TeamPlayerId } from '@domain/strategy/value-objects/team-player-id';
import { StrategyId } from '@domain/strategy/value-objects/strategy-id';
import { WaypointId } from '@domain/strategy/value-objects/waypoint-id';
import { DeleteWaypointCommand } from '@domain/strategy/commands/waypoint/delete-waypoint.command';

describe('DeleteWaypointCommand', () => {
    const strategyId = StrategyId.generate();
    const teamPlayerId = TeamPlayerId.generate();
    const waypointId = WaypointId.generate();

    it('웨이포인트 삭제 Command가 생성된다.', () => {
        //when
        const command = DeleteWaypointCommand.create(
            strategyId,
            teamPlayerId,
            waypointId
        );

        // then
        expect(command).toBeInstanceOf(DeleteWaypointCommand);
        expect(command.strategyId).toEqual(strategyId);
        expect(command.teamPlayerId).toEqual(teamPlayerId);
        expect(command.waypointId).toEqual(waypointId);
    });
});
