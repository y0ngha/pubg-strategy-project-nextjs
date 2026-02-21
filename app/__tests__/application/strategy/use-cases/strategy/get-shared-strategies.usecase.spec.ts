import { UserId } from '@domain/shared/value-objects/user-id';
import { getStrategyQueryRepositoryMocking } from '@/__tests__/application/helpers/repository-mocking.helpers';
import { StrategyId } from '@domain/strategy/value-objects/strategy-id';
import { StrategyQueryRepositoryPort } from '@domain/strategy/port/repositories/strategy-query-repository.port';
import { StrategyMapper } from '@/application/strategy/mappers/strategy.mapper';
import { PubgMap } from '@domain/strategy/enums/map.enum';
import { GetSharedStrategiesUseCase } from '@/application/strategy/use-cases/strategy/get-shared-strategies.usecase';

describe('GetSharedStrategiesUseCase', () => {
    let useCase: GetSharedStrategiesUseCase;
    let mockStrategyQueryRepository: jest.Mocked<StrategyQueryRepositoryPort>;
    const strategyMapper = new StrategyMapper();

    beforeEach(() => {
        mockStrategyQueryRepository = getStrategyQueryRepositoryMocking();

        useCase = new GetSharedStrategiesUseCase(
            mockStrategyQueryRepository,
            strategyMapper
        );
    });

    describe('성공 테스트', () => {
        it('Query를 생성하여 Repository에 전달한다.', async () => {
            // given
            const dto = {
                page: 1,
                limit: 10,
            };

            mockStrategyQueryRepository.findSharedStrategies.mockResolvedValue({
                hasNextPage: false,
                data: [
                    {
                        id: StrategyId.generate().toString(),
                        ownerId: UserId.generate().toString(),
                        ownerEmail: 'test@domain.com',
                        title: 'Test',
                        map: PubgMap.ERANGEL,
                        teamPlayers: [],
                        enemyTeams: [],
                        circles: [],
                        airplanePath: null,
                        tags: [],
                        shares: [],
                        comments: [],
                        createdAt: new Date(),
                        updatedAt: new Date(),
                    },
                ],
            });

            // when
            await useCase.execute(dto);

            // then
            expect(
                mockStrategyQueryRepository.findSharedStrategies
            ).toHaveBeenCalledTimes(1);
            expect(
                mockStrategyQueryRepository.findSharedStrategies
            ).toHaveBeenCalledWith(dto.page, dto.limit);
        });
    });

    it('Use Case 내 도메인 호출 과정에서 예외가 발생하면, 예외가 그대로 전파되어야 한다.', async () => {
        // given
        jest.spyOn(
            mockStrategyQueryRepository,
            'findSharedStrategies'
        ).mockImplementation(() => {
            throw new Error();
        });

        const dto = {
            page: 1,
            limit: 10,
        };

        // when & then
        await expect(() => useCase.execute(dto)).rejects.toThrow(Error);
    });
});
