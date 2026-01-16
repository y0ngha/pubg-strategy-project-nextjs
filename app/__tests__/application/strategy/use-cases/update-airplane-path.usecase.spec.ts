import { StrategyRepositoryPort } from '@domain/strategy/port/out/strategy-repository.port';
import { StrategyNotFoundException } from '@domain/strategy/exceptions/strategy.exceptions';
import { Strategy } from '@domain/strategy/entities/strategy.entity';
import { UserId } from '@domain/shared/value-objects/user-id';
import { StrategyId } from '@domain/strategy/value-objects/strategy-id';
import { PubgMap } from '@domain/strategy/enums/map.enum';
import { UpdateAirplanePathUseCase } from '@/application/strategy/use-cases/airplane-path/update-airplane-path.usecase';
import { Position } from '@domain/strategy/value-objects/position';
import { StrategyTitle } from '@domain/strategy/value-objects/strategy-title';
import { getStrategyRepositoryMocking } from '@/__tests__/application/helpers/repository-mocking.helpers';

describe('UpdateAirplanePathUseCase', () => {
    let useCase: UpdateAirplanePathUseCase;
    let mockStrategyRepository: jest.Mocked<StrategyRepositoryPort>;
    let strategyFixture: Strategy;

    const ownerId = UserId.generate();

    let strategyId: StrategyId;

    const title = StrategyTitle.create('전략 제목');
    const map = PubgMap.ERANGEL;

    beforeEach(() => {
        mockStrategyRepository = getStrategyRepositoryMocking();

        useCase = new UpdateAirplanePathUseCase(mockStrategyRepository);

        strategyFixture = Strategy.create(ownerId, title, map);
        strategyId = strategyFixture.id;
    });

    it('전략을 찾지 못하면, 에러를 던진다.', async () => {
        // given
        mockStrategyRepository.findById.mockResolvedValue(null);
        const dto = {
            actorId: ownerId.toString(),
            strategyId: strategyId.toString(),
            startPosition: {
                x: 10,
                y: 10,
            },
            endPosition: {
                x: 100,
                y: 100,
            },
        };

        // when & then
        await expect(() => useCase.execute(dto)).rejects.toThrow(
            StrategyNotFoundException
        );
        expect(mockStrategyRepository.findById).toHaveBeenCalledTimes(1);
    });

    it('비행기 동선이 수정된다.', async () => {
        // given
        mockStrategyRepository.findById.mockResolvedValue(strategyFixture);

        const dto = {
            actorId: ownerId.toString(),
            strategyId: strategyId.toString(),
            startPosition: {
                x: 10,
                y: 10,
            },
            endPosition: {
                x: 100,
                y: 100,
            },
        };

        // when
        await useCase.execute(dto);

        // then
        expect(mockStrategyRepository.findById).toHaveBeenCalledTimes(1);
        expect(mockStrategyRepository.save).toHaveBeenCalledTimes(1);

        expect(strategyFixture.airplanePath).not.toBeNull();
        expect(strategyFixture.airplanePath?.startPosition).toEqual(
            dto.startPosition
        );
        expect(strategyFixture.airplanePath?.endPosition).toEqual(
            dto.endPosition
        );
    });

    it('비행기 동선이 있을 때, 기존 비행기 동선이 수정된다.', async () => {
        // given
        mockStrategyRepository.findById.mockResolvedValue(strategyFixture);
        const oldStartPosition = Position.create(100, 100);
        const oldEndPosition = Position.create(1000, 1000);
        strategyFixture.updateAirplanePath(
            ownerId,
            oldStartPosition,
            oldEndPosition
        );

        const dto = {
            actorId: ownerId.toString(),
            strategyId: strategyId.toString(),
            startPosition: {
                x: 10,
                y: 10,
            },
            endPosition: {
                x: 100,
                y: 100,
            },
        };

        // when
        await useCase.execute(dto);

        // then
        expect(mockStrategyRepository.findById).toHaveBeenCalledTimes(1);
        expect(mockStrategyRepository.save).toHaveBeenCalledTimes(1);

        expect(strategyFixture.airplanePath).not.toBeNull();
        expect(strategyFixture.airplanePath?.startPosition).not.toEqual(
            oldStartPosition
        );
        expect(strategyFixture.airplanePath?.startPosition).toEqual(
            dto.startPosition
        );
        expect(strategyFixture.airplanePath?.endPosition).not.toEqual(
            oldEndPosition
        );
        expect(strategyFixture.airplanePath?.endPosition).toEqual(
            dto.endPosition
        );
    });
});
