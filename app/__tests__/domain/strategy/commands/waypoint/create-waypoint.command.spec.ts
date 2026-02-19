import { Position } from '@domain/strategy/value-objects/position';
import { TeamPlayerId } from '@domain/strategy/value-objects/team-player-id';
import { StrategyId } from '@domain/strategy/value-objects/strategy-id';
import { CreateWaypointCommand } from '@domain/strategy/commands/waypoint/create-waypoint.command';
import {
    WaypointCreateDuplicatePositionException,
    WaypointPositionLimitExceededException,
} from '@domain/strategy/exceptions/strategy.exceptions';

describe('CreateWaypointCommand', () => {
    const strategyId = StrategyId.generate();
    const teamPlayerId = TeamPlayerId.generate();

    it('포지션이 중복되지 않고, 6개 이하일 경우 웨이포인트 생성 Command가 생성된다.', () => {
        // given
        const positions = [Position.create(10, 10)];

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

    it('포지션이 7개 이상인 경우 에러를 던진다.', () => {
        // given
        const positions = [
            Position.create(10, 10),
            Position.create(20, 20),
            Position.create(30, 30),
            Position.create(40, 40),
            Position.create(50, 50),
            Position.create(60, 60),
            Position.create(70, 70),
        ];

        //when & then
        expect(() =>
            CreateWaypointCommand.create(strategyId, teamPlayerId, positions)
        ).toThrow(WaypointPositionLimitExceededException);
    });

    it('포지션이 중복된 경우 에러를 던진다.', () => {
        // given
        const positions = [Position.create(10, 10), Position.create(10, 10)];

        //when & then
        expect(() =>
            CreateWaypointCommand.create(strategyId, teamPlayerId, positions)
        ).toThrow(WaypointCreateDuplicatePositionException);
    });
});
