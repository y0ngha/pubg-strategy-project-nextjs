import { Position } from '@domain/strategy/value-objects/position';
import { TeamPlayerId } from '@domain/strategy/value-objects/team-player-id';
import { StrategyId } from '@domain/strategy/value-objects/strategy-id';
import { UpdateMarkerPositionCommand } from '@domain/strategy/commands/marker/update-marker-position.command';
import { MarkerId } from '@domain/strategy/value-objects/marker-id';

describe('UpdateMarkerPositionCommand', () => {
    it('마커 위치 업데이트 Command가 생성된다.', () => {
        // given
        const strategyId = StrategyId.generate();
        const teamPlayerId = TeamPlayerId.generate();
        const markerId = MarkerId.generate();
        const position = Position.create(10, 10);

        //when
        const command = UpdateMarkerPositionCommand.create(
            strategyId,
            teamPlayerId,
            markerId,
            position
        );

        // then
        expect(command).toBeInstanceOf(UpdateMarkerPositionCommand);
        expect(command.strategyId).toEqual(strategyId);
        expect(command.teamPlayerId).toEqual(teamPlayerId);
        expect(command.position).toEqual(position);
    });
});
