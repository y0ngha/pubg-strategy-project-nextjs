import { StrategyRepositoryPort } from '@domain/strategy/port/out/strategy-repository.port';
import { Strategy } from '@domain/strategy/entities/strategy.entity';
import { UserId } from '@domain/shared/value-objects/user-id';
import { PubgMap } from '@domain/strategy/enums/map.enum';
import { StrategyTitle } from '@domain/strategy/value-objects/strategy-title';
import { StrategyMapper } from '@/application/strategy/mappers/strategy.mapper';
import { getStrategyRepositoryMocking } from '@/__tests__/application/helpers/repository-mocking.helpers';
import { GetSharedStrategiesUseCase } from '@/application/strategy/use-cases/get-shared-strategies.usecase';
import { Email } from '@domain/shared/value-objects/email';
import { StrategySharePermission } from '@domain/strategy/enums/strategy-share-permission.enum';

describe('GetSharedStrategiesUseCase', () => {
    let useCase: GetSharedStrategiesUseCase;
    let mockStrategyRepository: jest.Mocked<StrategyRepositoryPort>;
    const strategyMapper = new StrategyMapper();

    let strategyFixture1: Strategy;
    let strategyFixture2: Strategy;
    let strategyFixture3: Strategy;
    let strategyFixture4: Strategy;
    let strategyFixture5: Strategy;

    const myId = UserId.generate();
    const myEmail = Email.create('test@domain.com');
    const ownerId = UserId.generate();
    const ownerEmail = Email.create('test@domain.com');

    const title1 = StrategyTitle.create('전략 제목');
    const title2 = StrategyTitle.create('가나라');
    const title3 = StrategyTitle.create('마바사');

    const map = PubgMap.ERANGEL;

    beforeEach(() => {
        jest.useFakeTimers();

        mockStrategyRepository = getStrategyRepositoryMocking();

        useCase = new GetSharedStrategiesUseCase(
            mockStrategyRepository,
            strategyMapper
        );

        strategyFixture1 = Strategy.create(ownerId, ownerEmail, title2, map);
        strategyFixture1.addStrategyShare(
            ownerId,
            myId,
            myEmail,
            StrategySharePermission.EDITABLE
        );
        strategyFixture2 = Strategy.create(ownerId, ownerEmail, title1, map);
        strategyFixture2.addStrategyShare(
            ownerId,
            myId,
            myEmail,
            StrategySharePermission.READ_ONLY
        );

        jest.advanceTimersByTime(1000 * 60 * 60);

        strategyFixture3 = Strategy.create(ownerId, ownerEmail, title1, map);
        strategyFixture3.addStrategyShare(
            ownerId,
            myId,
            myEmail,
            StrategySharePermission.READ_ONLY
        );

        jest.advanceTimersByTime(1000 * 60 * 60);

        strategyFixture4 = Strategy.create(ownerId, ownerEmail, title2, map);
        strategyFixture4.addStrategyShare(
            ownerId,
            myId,
            myEmail,
            StrategySharePermission.READ_ONLY
        );

        strategyFixture5 = Strategy.create(ownerId, ownerEmail, title3, map);
        strategyFixture5.addStrategyShare(
            ownerId,
            myId,
            myEmail,
            StrategySharePermission.EDITABLE
        );
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    it('공유받은 전략을 조회한다.', async () => {
        // given
        mockStrategyRepository.findSharedStrategiesByUserID.mockResolvedValue({
            hasNextPage: false,
            data: [
                strategyFixture1,
                strategyFixture2,
                strategyFixture3,
                strategyFixture4,
                strategyFixture5,
            ],
        });

        const dto = {
            actorId: myId.toString(),
            page: 1,
            limit: 100,
        };

        // when
        const strategies = await useCase.execute(dto);

        // then
        expect(strategies.data).toHaveLength(5);

        const expectedIds = [
            strategyFixture1.id.toString(),
            strategyFixture2.id.toString(),
            strategyFixture3.id.toString(),
            strategyFixture4.id.toString(),
            strategyFixture5.id.toString(),
        ];
        expect(strategies.data.map(s => s.id)).toEqual(expectedIds);
    });

    it('조회된 전략이 하나도 없는 경우 빈 배열을 반환한다.', async () => {
        // given
        mockStrategyRepository.findSharedStrategiesByUserID.mockResolvedValue({
            hasNextPage: false,
            data: [],
        });

        const dto = {
            actorId: myId.toString(),
            page: 1,
            limit: 100,
        };

        // when
        const strategies = await useCase.execute(dto);

        // then
        expect(strategies.data).toHaveLength(0);
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
            page: 1,
            limit: 100,
        };

        //when & then
        await expect(() => useCase.execute(dto)).rejects.toThrow(Error);
    });
});
