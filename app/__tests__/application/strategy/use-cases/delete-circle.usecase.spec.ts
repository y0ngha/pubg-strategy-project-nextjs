import { StrategyRepositoryPort } from '@domain/strategy/port/out/strategy-repository.port';
import {
    CircleNotFoundException,
    StrategyNotFoundException,
} from '@domain/strategy/exceptions/strategy.exceptions';
import { Strategy } from '@domain/strategy/entities/strategy.entity';
import { UserId } from '@domain/shared/value-objects/user-id';
import { StrategyId } from '@domain/strategy/value-objects/strategy-id';
import { PubgMap } from '@domain/strategy/enums/map.enum';
import { DeleteCircleUseCase } from '@/application/strategy/use-cases/circle/delete-circle.usecase';
import { CircleId } from '@domain/strategy/value-objects/circle-id';

describe('DeleteCircleUseCase', () => {
    let useCase: DeleteCircleUseCase;
    let mockStrategyRepository: jest.Mocked<StrategyRepositoryPort>;
    let strategyFixture: Strategy;

    const ownerId = UserId.generate();

    let strategyId: StrategyId;
    let circleId: CircleId;

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

        useCase = new DeleteCircleUseCase(mockStrategyRepository);

        strategyFixture = Strategy.create(ownerId, title, map);
        strategyId = strategyFixture.id;

        strategyFixture.addCircle(ownerId, 1);
        circleId = strategyFixture.circles[0].id;
    });

    it('전략을 찾지 못하면, 에러를 던진다.', async () => {
        // given
        mockStrategyRepository.findById.mockResolvedValue(null);
        const dto = {
            actorId: ownerId.toString(),
            strategyId: strategyId.toString(),
            circleId: circleId.toString(),
        };

        // when & then
        await expect(() => useCase.execute(dto)).rejects.toThrow(
            StrategyNotFoundException
        );
        expect(mockStrategyRepository.findById).toHaveBeenCalledTimes(1);
    });

    it('자기장을 찾지 못하면, 에러를 던진다.', async () => {
        // given
        mockStrategyRepository.findById.mockResolvedValue(strategyFixture);
        const randomId = CircleId.generate();

        const dto = {
            actorId: ownerId.toString(),
            strategyId: strategyId.toString(),
            circleId: randomId.toString(),
        };

        // when & then
        await expect(() => useCase.execute(dto)).rejects.toThrow(
            CircleNotFoundException
        );
        expect(mockStrategyRepository.findById).toHaveBeenCalledTimes(1);
    });

    it('자기장이 삭제된다.', async () => {
        // given
        mockStrategyRepository.findById.mockResolvedValue(strategyFixture);

        const dto = {
            actorId: ownerId.toString(),
            strategyId: strategyId.toString(),
            circleId: circleId.toString(),
        };

        // when
        await useCase.execute(dto);

        // then
        expect(mockStrategyRepository.findById).toHaveBeenCalledTimes(1);
        expect(mockStrategyRepository.save).toHaveBeenCalledTimes(1);

        const circle = strategyFixture.circles.find(circle =>
            circle.id.equals(circleId)
        );

        expect(circle).toBeUndefined();
    });
});
