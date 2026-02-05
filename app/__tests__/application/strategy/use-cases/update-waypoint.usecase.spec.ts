import { StrategyRepositoryPort } from '@domain/strategy/port/out/strategy-repository.port';
import {
    StrategyEditPermissionDeniedException,
    StrategyNotFoundException,
    TeamPlayerNotFoundException,
    WaypointNotFoundException,
} from '@domain/strategy/exceptions/strategy.exceptions';
import { Strategy } from '@domain/strategy/entities/strategy.entity';
import { UserId } from '@domain/shared/value-objects/user-id';
import { StrategyId } from '@domain/strategy/value-objects/strategy-id';
import { TeamPlayerId } from '@domain/strategy/value-objects/team-player-id';
import { PubgMap } from '@domain/strategy/enums/map.enum';
import { UpdateWaypointUseCase } from '@/application/strategy/use-cases/waypoint/update-waypoint.usecase';
import { StrategyTitle } from '@domain/strategy/value-objects/strategy-title';
import { getStrategyRepositoryMocking } from '@/__tests__/application/helpers/repository-mocking.helpers';
import { Position } from '@domain/strategy/value-objects/position';
import { Email } from '@domain/shared/value-objects/email';
import { WaypointId } from '@domain/strategy/value-objects/waypoint-id';

describe('UpdateWaypointUseCase', () => {
    let useCase: UpdateWaypointUseCase;
    let mockStrategyRepository: jest.Mocked<StrategyRepositoryPort>;
    let strategyFixture: Strategy;

    const ownerId = UserId.generate();
    const ownerEmail = Email.create('test@domain.com');

    let strategyId: StrategyId;
    let teamPlayerId: TeamPlayerId;
    let waypointId: TeamPlayerId;
    const positions = [
        {
            x: 10,
            y: 10,
        },
        {
            x: 10,
            y: 20,
        },
        {
            x: 10,
            y: 30,
        },
        {
            x: 10,
            y: 40,
        },
        {
            x: 10,
            y: 50,
        },
    ];

    const title = StrategyTitle.create('전략 제목');
    const map = PubgMap.ERANGEL;

    beforeEach(() => {
        mockStrategyRepository = getStrategyRepositoryMocking();

        useCase = new UpdateWaypointUseCase(mockStrategyRepository);

        strategyFixture = Strategy.create(ownerId, ownerEmail, title, map);
        strategyId = strategyFixture.id;

        const teamPlayer = strategyFixture.addTeamPlayer(
            ownerId,
            Position.create(1, 1)
        );
        teamPlayerId = teamPlayer.id;

        const waypoint = strategyFixture.addTeamPlayerWaypoint(
            ownerId,
            teamPlayerId,
            [Position.create(1, 1)]
        );
        waypointId = waypoint.id;
    });

    it('전략을 찾지 못하면, 에러를 던진다.', async () => {
        // given
        mockStrategyRepository.findById.mockResolvedValue(null);
        const dto = {
            actorId: ownerId.toString(),
            strategyId: strategyId.toString(),
            teamPlayerId: teamPlayerId.toString(),
            waypointId: waypointId.toString(),
            positions: positions,
        };

        // when & then
        await expect(() => useCase.execute(dto)).rejects.toThrow(
            StrategyNotFoundException
        );
        expect(mockStrategyRepository.findById).toHaveBeenCalledTimes(1);
    });

    it('팀 플레이어를 찾지 못하면, 에러를 던진다.', async () => {
        // given
        mockStrategyRepository.findById.mockResolvedValue(strategyFixture);
        const randomId = TeamPlayerId.generate();

        const dto = {
            actorId: ownerId.toString(),
            strategyId: strategyId.toString(),
            teamPlayerId: randomId.toString(),
            waypointId: waypointId.toString(),
            positions: positions,
        };

        // when & then
        await expect(() => useCase.execute(dto)).rejects.toThrow(
            TeamPlayerNotFoundException
        );
        expect(mockStrategyRepository.findById).toHaveBeenCalledTimes(1);
    });

    it('웨이포인트를 못찾으면, 에러를 던진다.', async () => {
        // given
        mockStrategyRepository.findById.mockResolvedValue(strategyFixture);
        const randomId = WaypointId.generate();

        const dto = {
            actorId: ownerId.toString(),
            strategyId: strategyId.toString(),
            teamPlayerId: teamPlayerId.toString(),
            waypointId: randomId.toString(),
            positions: positions,
        };

        // when & then
        await expect(() => useCase.execute(dto)).rejects.toThrow(
            WaypointNotFoundException
        );
    });

    it('웨이포인트가 있을 때 웨이포인트가 수정된다.', async () => {
        // given
        mockStrategyRepository.findById.mockResolvedValue(strategyFixture);

        const dto = {
            actorId: ownerId.toString(),
            strategyId: strategyId.toString(),
            teamPlayerId: teamPlayerId.toString(),
            waypointId: waypointId.toString(),
            positions: positions,
        };

        // when
        await useCase.execute(dto);

        // then
        expect(mockStrategyRepository.findById).toHaveBeenCalledTimes(1);
        expect(mockStrategyRepository.save).toHaveBeenCalledTimes(1);

        const teamPlayer = strategyFixture.teamPlayers.find(teamPlayer =>
            teamPlayer.id.equals(teamPlayerId)
        );

        const updatedPositions = teamPlayer?.waypoint?.positions?.map(
            position => {
                return {
                    x: position.x,
                    y: position.y,
                };
            }
        );

        expect(teamPlayer?.waypoint).toBeDefined();
        expect(updatedPositions).toEqual(positions);
    });

    it('Use Case 내 도메인 호출 과정에서 예외가 발생하면, 예외가 그대로 전파되어야 한다.', async () => {
        // Given
        jest.spyOn(
            strategyFixture,
            'updateTeamPlayerWaypoint'
        ).mockImplementation(() => {
            throw new StrategyEditPermissionDeniedException();
        });

        mockStrategyRepository.findById.mockResolvedValue(strategyFixture);

        const dto = {
            actorId: ownerId.toString(),
            strategyId: strategyId.toString(),
            teamPlayerId: teamPlayerId.toString(),
            waypointId: waypointId.toString(),
            positions: positions,
        };

        // When & Then
        await expect(useCase.execute(dto)).rejects.toThrow(
            StrategyEditPermissionDeniedException
        );
    });
});
