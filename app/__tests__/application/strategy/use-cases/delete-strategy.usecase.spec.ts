import { StrategyRepositoryPort } from '@domain/strategy/port/out/strategy-repository.port';
import { UserId } from '@domain/shared/value-objects/user-id';
import { PubgMap } from '@domain/strategy/enums/map.enum';
import { DeleteStrategyUseCase } from '@/application/strategy/use-cases/delete-strategy.usecase';
import {
    StrategyNotFoundException,
    StrategyPermissionDeniedException,
} from '@domain/strategy/exceptions/strategy.exceptions';
import { Strategy } from '@domain/strategy/entities/strategy.entity';
import { StrategyId } from '@domain/strategy/value-objects/strategy-id';

describe('DeleteStrategyUseCase', () => {
    let useCase: DeleteStrategyUseCase;
    let mockStrategyRepository: jest.Mocked<StrategyRepositoryPort>;

    let strategyFixture: Strategy;
    let strategyId: StrategyId;

    const ownerId = UserId.generate();
    const title = '전략 생성 테스트';
    const map = PubgMap.ERANGEL;

    beforeEach(() => {
        mockStrategyRepository = {
            save: jest.fn(),
            delete: jest.fn(),
            findById: jest.fn(),
            findOwnedStrategiesByUserID: jest.fn(),
            findSharedStrategiesByUserID: jest.fn(),
        } as jest.Mocked<StrategyRepositoryPort>;

        strategyFixture = Strategy.create(ownerId, title, map);
        strategyId = strategyFixture.id;

        useCase = new DeleteStrategyUseCase(mockStrategyRepository);
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

    it('전략이 삭제된다.', async () => {
        // given
        mockStrategyRepository.findById.mockResolvedValue(strategyFixture);

        const dto = {
            actorId: ownerId.toString(),
            strategyId: strategyId.toString(),
        };

        // when
        await useCase.execute(dto);

        // then
        expect(mockStrategyRepository.delete).toHaveBeenCalledTimes(1);
        const deletedStrategyId =
            mockStrategyRepository.delete.mock.calls[0][0];

        expect(deletedStrategyId.toString()).toEqual(dto.strategyId);
    });

    it('도메인 엔티티에서 예외가 발생하면, 예외가 그대로 전파되어야 한다', async () => {
        // given
        jest.spyOn(mockStrategyRepository, 'delete').mockImplementation(() => {
            throw new StrategyPermissionDeniedException();
        });

        const dto = {
            actorId: ownerId.toString(),
            strategyId: strategyId.toString(),
        };

        //when & then
        await expect(() => useCase.execute(dto)).rejects.toThrow(Error);
    });
});
