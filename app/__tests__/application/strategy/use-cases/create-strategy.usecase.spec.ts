import { StrategyRepositoryPort } from '@domain/strategy/port/out/strategy-repository.port';
import { UserId } from '@domain/shared/value-objects/user-id';
import { CreateStrategyUseCase } from '@/application/strategy/use-cases/create-strategy.usecase';
import { PubgMap } from '@domain/strategy/enums/map.enum';

describe('CreateStrategyUseCase', () => {
    let useCase: CreateStrategyUseCase;
    let mockStrategyRepository: jest.Mocked<StrategyRepositoryPort>;

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

        useCase = new CreateStrategyUseCase(mockStrategyRepository);
    });

    it('전략이 생성된다.', async () => {
        // given
        const dto = {
            actorId: ownerId.toString(),
            title: title,
            map: map,
        };

        // when
        await useCase.execute(dto);

        // then
        expect(mockStrategyRepository.save).toHaveBeenCalledTimes(1);

        const savedStrategy = mockStrategyRepository.save.mock.calls[0][0];

        expect(savedStrategy.title).toEqual(dto.title);
        expect(savedStrategy.map).toEqual(dto.map);
        expect(savedStrategy.ownerId.toString()).toEqual(dto.actorId);
    });

    it('예외가 발생하면, 예외가 그대로 전파되어야 한다', async () => {
        // given
        jest.spyOn(mockStrategyRepository, 'save').mockImplementation(() => {
            throw new Error();
        });

        const dto = {
            actorId: ownerId.toString(),
            title: title,
            map: map,
        };

        //when & then
        await expect(() => useCase.execute(dto)).rejects.toThrow(Error);
    });
});
