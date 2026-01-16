import { StrategyRepositoryPort } from '@domain/strategy/port/out/strategy-repository.port';
import { Strategy } from '@domain/strategy/entities/strategy.entity';
import { UserId } from '@domain/shared/value-objects/user-id';
import { PubgMap } from '@domain/strategy/enums/map.enum';
import { StrategySharePermission } from '@domain/strategy/enums/strategy-share-permission.enum';
import { StrategyTitle } from '@domain/strategy/value-objects/strategy-title';
import { StrategyMapper } from '@/application/strategy/mappers/strategy.mapper';
import { Email } from '@domain/shared/value-objects/email';
import { GetStrategiesUseCase } from '@/application/strategy/use-cases/get-strategies.usecase';
import { getStrategyRepositoryMocking } from '@/__tests__/application/helpers/repository-mocking.helpers';

describe('GetStrategiesUseCase', () => {
    let useCase: GetStrategiesUseCase;
    let mockStrategyRepository: jest.Mocked<StrategyRepositoryPort>;
    const strategyMapper = new StrategyMapper();

    let strategyFixture: Strategy;
    let sharedStrategyFixture1: Strategy;
    let sharedStrategyFixture2: Strategy;

    const myId = UserId.generate();
    const myEmail = Email.create('test@domain.com');
    const strangerId = UserId.generate();

    const title1 = StrategyTitle.create('전략 제목');
    const title2 = StrategyTitle.create('가나라');
    const title3 = StrategyTitle.create('마바사');

    const map = PubgMap.ERANGEL;

    beforeEach(() => {
        jest.useFakeTimers();

        mockStrategyRepository = getStrategyRepositoryMocking();

        useCase = new GetStrategiesUseCase(
            mockStrategyRepository,
            strategyMapper
        );

        strategyFixture = Strategy.create(myId, title1, map);

        jest.advanceTimersByTime(3600000);

        sharedStrategyFixture1 = Strategy.create(strangerId, title2, map);
        sharedStrategyFixture2 = Strategy.create(strangerId, title3, map);

        sharedStrategyFixture1.addStrategyShare(
            strangerId,
            myId,
            myEmail,
            StrategySharePermission.READ_ONLY
        );
        sharedStrategyFixture2.addStrategyShare(
            strangerId,
            myId,
            myEmail,
            StrategySharePermission.EDITABLE
        );
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    it('내 전략과 공유받은 전략을 합쳐서 조회하며, [최신순 -> 이름순]으로 정렬하여 반환한다.', async () => {
        // given
        mockStrategyRepository.findOwnedStrategiesByUserID.mockResolvedValue([
            strategyFixture,
        ]);
        mockStrategyRepository.findSharedStrategiesByUserID.mockResolvedValue([
            sharedStrategyFixture1,
            sharedStrategyFixture2,
        ]);

        const dto = {
            actorId: myId.toString(),
        };

        // when
        const strategies = await useCase.execute(dto);

        // then
        expect(strategies).toHaveLength(3);

        const expectedTitles = [
            title2.toString(),
            title3.toString(),
            title1.toString(),
        ];
        expect(strategies.map(s => s.title)).toEqual(expectedTitles);
    });

    it('조회된 전략이 하나도 없는 경우 빈 배열을 반환한다.', async () => {
        // given
        mockStrategyRepository.findOwnedStrategiesByUserID.mockResolvedValue(
            []
        );
        mockStrategyRepository.findSharedStrategiesByUserID.mockResolvedValue(
            []
        );

        const dto = {
            actorId: myId.toString(),
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
            'findSharedStrategiesByUserID'
        ).mockImplementation(() => {
            throw new Error();
        });

        const dto = {
            actorId: myId.toString(),
        };

        //when & then
        await expect(() => useCase.execute(dto)).rejects.toThrow(Error);
    });
});
