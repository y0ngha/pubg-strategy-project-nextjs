import { StrategyRepositoryPort } from '@domain/strategy/port/out/strategy-repository.port';
import { StrategyNotFoundException } from '@domain/strategy/exceptions/strategy.exceptions';
import { Strategy } from '@domain/strategy/entities/strategy.entity';
import { UserId } from '@domain/shared/value-objects/user-id';
import { StrategyId } from '@domain/strategy/value-objects/strategy-id';
import { PubgMap } from '@domain/strategy/enums/map.enum';
import { CreateCircleUseCase } from '@/application/strategy/use-cases/circle/create-circle.usecase';

describe('CreateCircleUseCase', () => {
    let useCase: CreateCircleUseCase;
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

        useCase = new CreateCircleUseCase(mockStrategyRepository);

        strategyFixture = Strategy.create(ownerId, title, map);
        strategyId = strategyFixture.id;
    });

    it('전략을 찾지 못하면, 에러를 던진다.', async () => {
        // given
        mockStrategyRepository.findById.mockResolvedValue(null);
        const dto = {
            actorId: ownerId.toString(),
            strategyId: strategyId.toString(),
            phase: 1,
        };

        // when & then
        await expect(() => useCase.execute(dto)).rejects.toThrow(
            StrategyNotFoundException
        );
        expect(mockStrategyRepository.findById).toHaveBeenCalledTimes(1);
    });

    it('자기장이 생성된다.', async () => {
        // given
        mockStrategyRepository.findById.mockResolvedValue(strategyFixture);

        const dto = {
            actorId: ownerId.toString(),
            strategyId: strategyId.toString(),
            phase: 1,
        };

        // when
        await useCase.execute(dto);

        // then
        expect(mockStrategyRepository.findById).toHaveBeenCalledTimes(1);
        expect(mockStrategyRepository.save).toHaveBeenCalledTimes(1);

        const addedCircle = strategyFixture.circles.find(
            circle => circle.phase === dto.phase
        );

        expect(strategyFixture.circles).toHaveLength(1);
        expect(addedCircle?.phase).toEqual(dto.phase);
    });
});
