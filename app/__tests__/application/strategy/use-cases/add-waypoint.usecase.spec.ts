import { StrategyRepositoryPort } from '@domain/strategy/port/out/strategy-repository.port';
import {
    StrategyEditPermissionDeniedException,
    StrategyNotFoundException,
    TeamPlayerNotFoundException,
} from '@domain/strategy/exceptions/strategy.exceptions';
import { Strategy } from '@domain/strategy/entities/strategy.entity';
import { UserId } from '@domain/shared/value-objects/user-id';
import { StrategyId } from '@domain/strategy/value-objects/strategy-id';
import { TeamPlayerId } from '@domain/strategy/value-objects/team-player-id';
import { PubgMap } from '@domain/strategy/enums/map.enum';
import { AddWaypointUseCase } from '@/application/strategy/use-cases/waypoint/add-waypoint.usecase';
import { StrategyTitle } from '@domain/strategy/value-objects/strategy-title';
import { getStrategyRepositoryMocking } from '@/__tests__/application/helpers/repository-mocking.helpers';
import { Email } from '@domain/shared/value-objects/email';
import { Position } from '@domain/strategy/value-objects/position';

describe('AddWaypointUseCase', () => {
    let useCase: AddWaypointUseCase;
    let mockStrategyRepository: jest.Mocked<StrategyRepositoryPort>;
    let strategyFixture: Strategy;

    const ownerId = UserId.generate();
    const teamPlayerPosiiton = Position.create(1, 1);
    const ownerEmail = Email.create('test@domain.com');

    let strategyId: StrategyId;
    let teamPlayerId: TeamPlayerId;
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

        useCase = new AddWaypointUseCase(mockStrategyRepository);

        strategyFixture = Strategy.create(ownerId, ownerEmail, title, map);
        strategyId = strategyFixture.id;

        strategyFixture.addTeamPlayer(ownerId, teamPlayerPosiiton);

        teamPlayerId = strategyFixture.teamPlayers[0].id;
    });

    it('전략을 찾지 못하면, 에러를 던진다.', async () => {
        // given
        mockStrategyRepository.findById.mockResolvedValue(null);
        const dto = {
            actorId: ownerId.toString(),
            strategyId: strategyId.toString(),
            teamPlayerId: teamPlayerId.toString(),
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
            positions: positions,
        };

        // when & then
        await expect(() => useCase.execute(dto)).rejects.toThrow(
            TeamPlayerNotFoundException
        );
        expect(mockStrategyRepository.findById).toHaveBeenCalledTimes(1);
    });

    it('웨이포인트가 없을 때 웨이포인트가 추가된다.', async () => {
        // given
        mockStrategyRepository.findById.mockResolvedValue(strategyFixture);

        const dto = {
            actorId: ownerId.toString(),
            strategyId: strategyId.toString(),
            teamPlayerId: teamPlayerId.toString(),
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

        const addedPositions = teamPlayer?.waypoint?.positions?.map(
            position => {
                return {
                    x: position.x,
                    y: position.y,
                };
            }
        );

        expect(teamPlayer?.waypoint).toBeDefined();
        expect(addedPositions).toEqual(positions);
    });

    it('Use Case 내 도메인 호출 과정에서 예외가 발생하면, 예외가 그대로 전파되어야 한다.', async () => {
        // Given
        jest.spyOn(strategyFixture, 'addTeamPlayerWaypoint').mockImplementation(
            () => {
                throw new StrategyEditPermissionDeniedException();
            }
        );

        mockStrategyRepository.findById.mockResolvedValue(strategyFixture);

        const dto = {
            actorId: ownerId.toString(),
            strategyId: strategyId.toString(),
            teamPlayerId: teamPlayerId.toString(),
            positions: positions,
        };

        // When & Then
        await expect(useCase.execute(dto)).rejects.toThrow(
            StrategyEditPermissionDeniedException
        );
    });
});
