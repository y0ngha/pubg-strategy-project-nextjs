import { UserId } from '@domain/shared/value-objects/user-id';
import { getStrategyQueryRepositoryMocking } from '@/__tests__/application/helpers/repository-mocking.helpers';
import { StrategyId } from '@domain/strategy/value-objects/strategy-id';
import { StrategyQueryRepositoryPort } from '@domain/strategy/port/repositories/strategy-query-repository.port';
import { StrategyMapper } from '@/application/strategy/mappers/strategy.mapper';
import { PubgMap } from '@domain/strategy/enums/map.enum';
import { GetStrategyUseCase } from '@/application/strategy/use-cases/strategy/get-strategy.usecase';
import { InvalidEntityIdException } from '@domain/shared/exceptions/entity-id.exceptions';

describe('Get', () => {
    let useCase: GetStrategyUseCase;
    let mockStrategyQueryRepository: jest.Mocked<StrategyQueryRepositoryPort>;
    const strategyMapper = new StrategyMapper();
    const strategyId = StrategyId.generate();

    beforeEach(() => {
        mockStrategyQueryRepository = getStrategyQueryRepositoryMocking();

        useCase = new GetStrategyUseCase(
            mockStrategyQueryRepository,
            strategyMapper
        );
    });

    describe('성공 테스트', () => {
        it('Query를 생성하여 Repository에 전달한다.', async () => {
            // given
            const dto = {
                strategyId: strategyId.toString(),
            };

            mockStrategyQueryRepository.findById.mockResolvedValue({
                id: strategyId.toString(),
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
            });

            // when
            await useCase.execute(dto);

            // then
            expect(mockStrategyQueryRepository.findById).toHaveBeenCalledTimes(
                1
            );
            expect(mockStrategyQueryRepository.findById).toHaveBeenCalledWith(
                expect.objectContaining({
                    strategyId: strategyId,
                })
            );
        });
    });

    describe('실패 테스트', () => {
        it('DTO 파싱과정에서 실패하면 에러가 발생하여 Repository에 전달하지도 않는다.', async () => {
            // give
            const dto = {
                strategyId: 'asdf-1234',
            };

            // when & then
            await expect(() => useCase.execute(dto)).rejects.toThrow(
                InvalidEntityIdException
            );

            expect(mockStrategyQueryRepository.findById).toHaveBeenCalledTimes(
                0
            );
        });
    });

    it('Use Case 내 도메인 호출 과정에서 예외가 발생하면, 예외가 그대로 전파되어야 한다.', async () => {
        // given
        jest.spyOn(mockStrategyQueryRepository, 'findById').mockImplementation(
            () => {
                throw new Error();
            }
        );

        const dto = {
            strategyId: strategyId.toString(),
        };

        // when & then
        await expect(() => useCase.execute(dto)).rejects.toThrow(Error);
    });
});
