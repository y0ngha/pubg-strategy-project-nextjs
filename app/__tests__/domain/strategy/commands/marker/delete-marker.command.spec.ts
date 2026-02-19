import { TeamPlayerId } from '@domain/strategy/value-objects/team-player-id';
import { StrategyId } from '@domain/strategy/value-objects/strategy-id';
import { MarkerId } from '@domain/strategy/value-objects/marker-id';
import { DeleteMarkerCommand } from '@domain/strategy/commands/marker/delete-marker.command';

describe('DeleteMarkerCommand', () => {
    it('마커 삭제 Command가 생성된다.', () => {
        // given
        const strategyId = StrategyId.generate();
        const teamPlayerId = TeamPlayerId.generate();
        const markerId = MarkerId.generate();

        //when
        const command = DeleteMarkerCommand.create(
            strategyId,
            teamPlayerId,
            markerId
        );

        // then
        expect(command).toBeInstanceOf(DeleteMarkerCommand);
        expect(command.strategyId).toEqual(strategyId);
        expect(command.teamPlayerId).toEqual(teamPlayerId);
        expect(command.markerId).toEqual(markerId);
    });
});
