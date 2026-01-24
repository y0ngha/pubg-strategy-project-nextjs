import { StrategyRepositoryPort } from '@domain/strategy/port/out/strategy-repository.port';
import { Strategy } from '@domain/strategy/entities/strategy.entity';
import { UserId } from '@domain/shared/value-objects/user-id';
import { PubgMap } from '@domain/strategy/enums/map.enum';
import { StrategyTitle } from '@domain/strategy/value-objects/strategy-title';
import { StrategyMapper } from '@/application/strategy/mappers/strategy.mapper';
import { getStrategyRepositoryMocking } from '@/__tests__/application/helpers/repository-mocking.helpers';
import { GetOwnedStrategiesUseCase } from '@/application/strategy/use-cases/get-owned-strategies.usecase';

describe('GetOwnedStrategiesUseCase', () => {
    let useCase: GetOwnedStrategiesUseCase;
    let mockStrategyRepository: jest.Mocked<StrategyRepositoryPort>;
    const strategyMapper = new StrategyMapper();

    let strategyFixture1: Strategy;
    let strategyFixture2: Strategy;
    let strategyFixture3: Strategy;
    let strategyFixture4: Strategy;
    let strategyFixture5: Strategy;

    const myId = UserId.generate();

    const title1 = StrategyTitle.create('전략 제목');
    const title2 = StrategyTitle.create('가나라');
    const title3 = StrategyTitle.create('마바사');

    const map = PubgMap.ERANGEL;

    beforeEach(() => {
        jest.useFakeTimers();

        mockStrategyRepository = getStrategyRepositoryMocking();

        useCase = new GetOwnedStrategiesUseCase(
            mockStrategyRepository,
            strategyMapper
        );

        strategyFixture1 = Strategy.create(myId, title2, map);
        strategyFixture2 = Strategy.create(myId, title1, map);

        jest.advanceTimersByTime(1000 * 60 * 60);

        strategyFixture3 = Strategy.create(myId, title1, map);

        jest.advanceTimersByTime(1000 * 60 * 60);

        strategyFixture4 = Strategy.create(myId, title2, map);
        strategyFixture5 = Strategy.create(myId, title3, map);
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    it('내 전략을 조회하며, [최신순 -> 이름순]으로 정렬하여 반환한다.', async () => {
        // given
        mockStrategyRepository.findOwnedStrategiesByUserID.mockResolvedValue([
            strategyFixture1,
            strategyFixture2,
            strategyFixture3,
            strategyFixture4,
            strategyFixture5,
        ]);

        const dto = {
            actorId: myId.toString(),
            page: 1,
            limit: 100,
        };

        // when
        const strategies = await useCase.execute(dto);

        // then
        expect(strategies).toHaveLength(5);

        const expectedIds = [
            strategyFixture4.id.toString(),
            strategyFixture5.id.toString(),
            strategyFixture3.id.toString(),
            strategyFixture1.id.toString(),
            strategyFixture2.id.toString(),
        ];
        expect(strategies.map(s => s.id)).toEqual(expectedIds);
    });

    it('조회된 전략이 하나도 없는 경우 빈 배열을 반환한다.', async () => {
        // given
        mockStrategyRepository.findOwnedStrategiesByUserID.mockResolvedValue(
            []
        );

        const dto = {
            actorId: myId.toString(),
            page: 1,
            limit: 100,
        };

        // when
        const strategies = await useCase.execute(dto);

        // then
        expect(strategies).toHaveLength(0);
    });

    it('예외가 발생하면, 예외가 그대로 전파되어야 한다.', async () => {
        // given
        jest.spyOn(
            mockStrategyRepository,
            'findOwnedStrategiesByUserID'
        ).mockImplementation(() => {
            throw new Error();
        });

        const dto = {
            actorId: myId.toString(),
            page: 1,
            limit: 100,
        };

        //when & then
        await expect(() => useCase.execute(dto)).rejects.toThrow(Error);
    });
});
