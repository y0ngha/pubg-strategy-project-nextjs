import { StrategyTitleBlankException } from '@domain/strategy/exceptions/strategy.exceptions';
import { StrategyId } from '@domain/strategy/value-objects/strategy-id';
import { UpdateStrategyTitleUseCase } from '@/application/strategy/use-cases/strategy/update-strategy-title.usecase';
import { StrategyTitle } from '@domain/strategy/value-objects/strategy-title';
import { getStrategyCommandRepositoryMocking } from '@/__tests__/application/helpers/repository-mocking.helpers';
import { StrategyCommandRepositoryPort } from '@domain/strategy/port/repositories/strategy-command-repository.port';

describe('UpdateStrategyUseCase', () => {
    let useCase: UpdateStrategyTitleUseCase;
    let mockStrategyCommandRepository: jest.Mocked<StrategyCommandRepositoryPort>;

    const strategyId = StrategyId.generate();
    const title = StrategyTitle.create('Test');

    beforeEach(() => {
        mockStrategyCommandRepository = getStrategyCommandRepositoryMocking();

        useCase = new UpdateStrategyTitleUseCase(mockStrategyCommandRepository);
    });

    describe('성공 테스트', () => {
        it('Command를 생성하여 Repository에 전달한다.', async () => {
            // given
            const dto = {
                strategyId: strategyId.toString(),
                title: title.toString(),
            };

            // when
            await useCase.execute(dto);

            // then
            expect(
                mockStrategyCommandRepository.updateStrategyTitle
            ).toHaveBeenCalledTimes(1);
            expect(
                mockStrategyCommandRepository.updateStrategyTitle
            ).toHaveBeenCalledWith(
                expect.objectContaining({
                    title: title,
                    map: strategyId,
                })
            );
        });
    });

    describe('실패 테스트', () => {
        it('DTO 파싱과정에서 실패하면 에러가 발생하여 Repository에 전달하지도 않는다.', async () => {
            // give
            const dto = {
                strategyId: strategyId.toString(),
                title: '',
            };

            // when & then
            await expect(() => useCase.execute(dto)).rejects.toThrow(
                StrategyTitleBlankException
            );

            expect(
                mockStrategyCommandRepository.updateStrategyTitle
            ).toHaveBeenCalledTimes(0);
        });
    });

    it('Use Case 내 도메인 호출 과정에서 예외가 발생하면, 예외가 그대로 전파되어야 한다.', async () => {
        // given
        jest.spyOn(
            mockStrategyCommandRepository,
            'updateStrategyTitle'
        ).mockImplementation(() => {
            throw new Error();
        });

        const dto = {
            strategyId: strategyId.toString(),
            title: title.toString(),
        };

        // when & then
        await expect(() => useCase.execute(dto)).rejects.toThrow(Error);
    });
});
