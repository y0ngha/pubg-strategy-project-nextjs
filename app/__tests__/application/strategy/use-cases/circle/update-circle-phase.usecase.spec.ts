import { StrategyId } from '@domain/strategy/value-objects/strategy-id';
import { getStrategyCommandRepositoryMocking } from '@/__tests__/application/helpers/repository-mocking.helpers';
import { StrategyCommandRepositoryPort } from '@domain/strategy/port/repositories/strategy-command-repository.port';
import { InvalidEntityIdException } from '@domain/shared/exceptions/entity-id.exceptions';
import { CircleId } from '@domain/strategy/value-objects/circle-id';
import { CirclePhase } from '@domain/strategy/value-objects/circle-phase';
import { UpdateCirclePhaseUseCase } from '@/application/strategy/use-cases/circle/update-circle-phase.usecase';

describe('UpdateCirclePhaseUseCase', () => {
    let useCase: UpdateCirclePhaseUseCase;
    let mockStrategyCommandRepository: jest.Mocked<StrategyCommandRepositoryPort>;

    const strategyId = StrategyId.generate();
    const circleId = CircleId.generate();
    const phase = CirclePhase.create(5);

    beforeEach(() => {
        mockStrategyCommandRepository = getStrategyCommandRepositoryMocking();

        useCase = new UpdateCirclePhaseUseCase(mockStrategyCommandRepository);
    });

    describe('성공 테스트', () => {
        it('Command를 생성하여 Repository에 전달한다.', async () => {
            // given
            const dto = {
                strategyId: strategyId.toString(),
                circleId: circleId.toString(),
                phase: phase.value,
            };

            // when
            await useCase.execute(dto);

            // then
            expect(
                mockStrategyCommandRepository.updateCirclePhase
            ).toHaveBeenCalledTimes(1);
            expect(
                mockStrategyCommandRepository.updateCirclePhase
            ).toHaveBeenCalledWith(
                expect.objectContaining({
                    strategyId: strategyId,
                    circleId: circleId,
                    phase: phase,
                })
            );
        });
    });

    describe('실패 테스트', () => {
        it('DTO 파싱과정에서 실패하면 에러가 발생하여 Repository에 전달하지도 않는다.', async () => {
            // give
            const dto = {
                strategyId: 'asdf-1234',
                circleId: circleId.toString(),
                phase: phase.value,
            };

            // when & then
            await expect(() => useCase.execute(dto)).rejects.toThrow(
                InvalidEntityIdException
            );

            expect(
                mockStrategyCommandRepository.updateCirclePhase
            ).toHaveBeenCalledTimes(0);
        });
    });

    it('Use Case 내 도메인 호출 과정에서 예외가 발생하면, 예외가 그대로 전파되어야 한다.', async () => {
        // given
        jest.spyOn(
            mockStrategyCommandRepository,
            'updateCirclePhase'
        ).mockImplementation(() => {
            throw new Error();
        });

        const dto = {
            strategyId: strategyId.toString(),
            circleId: circleId.toString(),
            phase: phase.value,
        };

        // when & then
        await expect(() => useCase.execute(dto)).rejects.toThrow(Error);
    });
});
