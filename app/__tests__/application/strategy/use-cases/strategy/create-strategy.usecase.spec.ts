import { CreateStrategyUseCase } from '@/application/strategy/use-cases/strategy/create-strategy.usecase';
import { getStrategyCommandRepositoryMocking } from '@/__tests__/application/helpers/repository-mocking.helpers';
import { StrategyCommandRepositoryPort } from '@domain/strategy/port/repositories/strategy-command-repository.port';
import { PubgMap } from '@domain/strategy/enums/map.enum';
import { StrategyTitle } from '@domain/strategy/value-objects/strategy-title';
import { StrategyId } from '@domain/strategy/value-objects/strategy-id';
import { UserId } from '@domain/shared/value-objects/user-id';
import { StrategyTitleBlankException } from '@domain/strategy/exceptions/strategy.exceptions';

describe('CreateStrategyUseCase', () => {
    let useCase: CreateStrategyUseCase;
    let mockStrategyCommandRepository: jest.Mocked<StrategyCommandRepositoryPort>;

    const title = StrategyTitle.create('Test');
    const map = PubgMap.ERANGEL;

    beforeEach(() => {
        mockStrategyCommandRepository = getStrategyCommandRepositoryMocking();

        useCase = new CreateStrategyUseCase(mockStrategyCommandRepository);
    });

    describe('성공 테스트', () => {
        it('Command를 생성하여 Repository에 전달한다.', async () => {
            // given
            const dto = {
                title: title.toString(),
                map: map.toString(),
            };

            mockStrategyCommandRepository.createStrategy.mockResolvedValue({
                id: StrategyId.generate().toString(),
                ownerId: UserId.generate().toString(),
                ownerEmail: 'test@domain.com',
                title: dto.title,
                map: dto.map,
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
            expect(
                mockStrategyCommandRepository.createStrategy
            ).toHaveBeenCalledTimes(1);
            expect(
                mockStrategyCommandRepository.createStrategy
            ).toHaveBeenCalledWith(
                expect.objectContaining({
                    title: title,
                    map: map,
                })
            );
        });
    });

    describe('실패 테스트', () => {
        it('DTO 파싱과정에서 실패하면 에러가 발생하여 Repository에 전달하지도 않는다.', async () => {
            // give
            const dto = {
                title: '',
                map: map.toString(),
            };

            // when & then
            await expect(() => useCase.execute(dto)).rejects.toThrow(
                StrategyTitleBlankException
            );

            expect(
                mockStrategyCommandRepository.createStrategy
            ).toHaveBeenCalledTimes(0);
        });
    });

    it('Use Case 내 도메인 호출 과정에서 예외가 발생하면, 예외가 그대로 전파되어야 한다.', async () => {
        // given
        jest.spyOn(
            mockStrategyCommandRepository,
            'createStrategy'
        ).mockImplementation(() => {
            throw new Error();
        });

        const dto = {
            title: title.toString(),
            map: map.toString(),
        };

        // when & then
        await expect(() => useCase.execute(dto)).rejects.toThrow(Error);
    });
});
