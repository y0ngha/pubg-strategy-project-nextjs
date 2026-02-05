import { StrategyRepositoryPort } from '@domain/strategy/port/out/strategy-repository.port';
import {
    MarkerNotFoundException,
    StrategyEditPermissionDeniedException,
    StrategyNotFoundException,
    TeamPlayerNotFoundException,
} from '@domain/strategy/exceptions/strategy.exceptions';
import { Strategy } from '@domain/strategy/entities/strategy.entity';
import { UserId } from '@domain/shared/value-objects/user-id';
import { StrategyId } from '@domain/strategy/value-objects/strategy-id';
import { TeamPlayerId } from '@domain/strategy/value-objects/team-player-id';
import { PubgMap } from '@domain/strategy/enums/map.enum';
import { StrategyTitle } from '@domain/strategy/value-objects/strategy-title';
import { getStrategyRepositoryMocking } from '@/__tests__/application/helpers/repository-mocking.helpers';
import { UpdateMarkerUseCase } from '@/application/strategy/use-cases/marker/update-marker.usecase';
import { Position } from '@domain/strategy/value-objects/position';
import { Email } from '@domain/shared/value-objects/email';
import { MarkerId } from '@domain/strategy/value-objects/marker-id';

describe('UpdateMarkerUseCase', () => {
    let useCase: UpdateMarkerUseCase;
    let mockStrategyRepository: jest.Mocked<StrategyRepositoryPort>;
    let strategyFixture: Strategy;

    const ownerId = UserId.generate();
    const ownerEmail = Email.create('test@domain.com');

    let strategyId: StrategyId;
    let teamPlayerId: TeamPlayerId;
    let markerId: MarkerId;

    const positionX = 10;
    const positionY = 200;
    const position = { x: positionX, y: positionY };

    const title = StrategyTitle.create('전략 제목');
    const map = PubgMap.ERANGEL;

    beforeEach(() => {
        mockStrategyRepository = getStrategyRepositoryMocking();

        useCase = new UpdateMarkerUseCase(mockStrategyRepository);

        strategyFixture = Strategy.create(ownerId, ownerEmail, title, map);
        strategyId = strategyFixture.id;

        const teamPlayer = strategyFixture.addTeamPlayer(
            ownerId,
            Position.create(1, 1)
        );
        teamPlayerId = teamPlayer.id;

        const marker = strategyFixture.addTeamPlayerMarker(
            ownerId,
            teamPlayerId,
            Position.create(100, 100)
        );
        markerId = marker.id;
    });

    it('전략을 찾지 못하면, 에러를 던진다.', async () => {
        // given
        mockStrategyRepository.findById.mockResolvedValue(null);
        const dto = {
            actorId: ownerId.toString(),
            strategyId: strategyId.toString(),
            teamPlayerId: teamPlayerId.toString(),
            markerId: markerId.toString(),
            position: position,
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
            markerId: markerId.toString(),
            position: position,
        };

        // when & then
        await expect(() => useCase.execute(dto)).rejects.toThrow(
            TeamPlayerNotFoundException
        );
        expect(mockStrategyRepository.findById).toHaveBeenCalledTimes(1);
    });

    it('마커를 찾지 못하면, 에러를 던진다.', async () => {
        // given
        mockStrategyRepository.findById.mockResolvedValue(strategyFixture);
        const randomId = MarkerId.generate();

        const dto = {
            actorId: ownerId.toString(),
            strategyId: strategyId.toString(),
            teamPlayerId: teamPlayerId.toString(),
            markerId: randomId.toString(),
            position: position,
        };

        // when & then
        await expect(() => useCase.execute(dto)).rejects.toThrow(
            MarkerNotFoundException
        );
    });

    it('마커의 위치가 수정된다.', async () => {
        // given
        mockStrategyRepository.findById.mockResolvedValue(strategyFixture);

        const dto = {
            actorId: ownerId.toString(),
            strategyId: strategyId.toString(),
            teamPlayerId: teamPlayerId.toString(),
            markerId: markerId.toString(),
            position: position,
        };

        // when
        await useCase.execute(dto);

        // then
        expect(mockStrategyRepository.findById).toHaveBeenCalledTimes(1);
        expect(mockStrategyRepository.save).toHaveBeenCalledTimes(1);

        const teamPlayer = strategyFixture.teamPlayers.find(teamPlayer =>
            teamPlayer.id.equals(teamPlayerId)
        );

        expect(teamPlayer?.marker?.position).toEqual(position);
    });

    it('Use Case 내 도메인 호출 과정에서 예외가 발생하면, 예외가 그대로 전파되어야 한다.', async () => {
        // Given
        jest.spyOn(
            strategyFixture,
            'updateTeamPlayerMarker'
        ).mockImplementation(() => {
            throw new StrategyEditPermissionDeniedException();
        });

        mockStrategyRepository.findById.mockResolvedValue(strategyFixture);

        const dto = {
            actorId: ownerId.toString(),
            strategyId: strategyId.toString(),
            teamPlayerId: teamPlayerId.toString(),
            markerId: markerId.toString(),
            position: position,
        };

        // When & Then
        await expect(useCase.execute(dto)).rejects.toThrow(
            StrategyEditPermissionDeniedException
        );
    });
});
