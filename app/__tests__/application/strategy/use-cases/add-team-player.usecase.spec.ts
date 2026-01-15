import { StrategyRepositoryPort } from '@domain/strategy/port/out/strategy-repository.port';
import {
    StrategyEditPermissionDeniedException,
    StrategyNotFoundException,
} from '@domain/strategy/exceptions/strategy.exceptions';
import { Strategy } from '@domain/strategy/entities/strategy.entity';
import { UserId } from '@domain/shared/value-objects/user-id';
import { StrategyId } from '@domain/strategy/value-objects/strategy-id';
import { PubgMap } from '@domain/strategy/enums/map.enum';
import { AddTeamPlayerUseCase } from '@/application/strategy/use-cases/team-player/add-team-player.usecase';

describe('AddTeamPlayerUseCase', () => {
    let useCase: AddTeamPlayerUseCase;
    let mockStrategyRepository: jest.Mocked<StrategyRepositoryPort>;
    let strategyFixture: Strategy;

    const ownerId = UserId.generate();

    let strategyId: StrategyId;

    const title = '전략 제목';
    const map = PubgMap.ERANGEL;

    beforeEach(() => {
        mockStrategyRepository = {
            save: jest.fn(),
            delete: jest.fn(),
            findById: jest.fn(),
            findOwnedStrategiesByUserID: jest.fn(),
            findSharedStrategiesByUserID: jest.fn(),
        } as jest.Mocked<StrategyRepositoryPort>;

        useCase = new AddTeamPlayerUseCase(mockStrategyRepository);

        strategyFixture = Strategy.create(ownerId, title, map);
        strategyId = strategyFixture.id;
    });

    it('전략을 찾지 못하면, 에러를 던진다.', async () => {
        // given
        mockStrategyRepository.findById.mockResolvedValue(null);
        const dto = {
            actorId: ownerId.toString(),
            strategyId: strategyId.toString(),
        };

        // when & then
        await expect(() => useCase.execute(dto)).rejects.toThrow(
            StrategyNotFoundException
        );
        expect(mockStrategyRepository.findById).toHaveBeenCalledTimes(1);
    });

    it('팀 플레이어가 추가된다.', async () => {
        // given
        mockStrategyRepository.findById.mockResolvedValue(strategyFixture);

        const dto = {
            actorId: ownerId.toString(),
            strategyId: strategyId.toString(),
        };

        // when
        await useCase.execute(dto);

        // then
        expect(mockStrategyRepository.findById).toHaveBeenCalledTimes(1);
        expect(mockStrategyRepository.save).toHaveBeenCalledTimes(1);

        expect(strategyFixture.teamPlayers).toHaveLength(2);
    });

    it('도메인 엔티티에서 예외가 발생하면, 예외가 그대로 전파되어야 한다', async () => {
        // given
        jest.spyOn(strategyFixture, 'addTeamPlayer').mockImplementation(() => {
            throw new StrategyEditPermissionDeniedException();
        });

        mockStrategyRepository.findById.mockResolvedValue(strategyFixture);

        const dto = {
            actorId: ownerId.toString(),
            strategyId: strategyId.toString(),
        };

        //when & then
        await expect(() => useCase.execute(dto)).rejects.toThrow(
            StrategyEditPermissionDeniedException
        );
    });
});
