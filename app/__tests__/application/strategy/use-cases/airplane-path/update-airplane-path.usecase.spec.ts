import { StrategyId } from '@domain/strategy/value-objects/strategy-id';
import { UpdateAirplanePathUseCase } from '@/application/strategy/use-cases/airplane-path/update-airplane-path.usecase';
import { getStrategyCommandRepositoryMocking } from '@/__tests__/application/helpers/repository-mocking.helpers';
import { AirplanePathId } from '@domain/strategy/value-objects/airplane-path-id';
import { StrategyCommandRepositoryPort } from '@domain/strategy/port/repositories/strategy-command-repository.port';
import { InvalidEntityIdException } from '@domain/shared/exceptions/entity-id.exceptions';
import { Position } from '@domain/strategy/value-objects/position';

describe('UpdateAirplanePathUseCase', () => {
    let useCase: UpdateAirplanePathUseCase;
    let mockStrategyCommandRepository: jest.Mocked<StrategyCommandRepositoryPort>;

    const strategyId = StrategyId.generate();
    const airplanePathId = AirplanePathId.generate();
    const startPosition = Position.create(10, 10);
    const endPosition = Position.create(10, 50);

    beforeEach(() => {
        mockStrategyCommandRepository = getStrategyCommandRepositoryMocking();

        useCase = new UpdateAirplanePathUseCase(mockStrategyCommandRepository);
    });

    describe('성공 테스트', () => {
        it('Command를 생성하여 Repository에 전달한다.', async () => {
            // given
            const dto = {
                strategyId: strategyId.toString(),
                airplanePathId: airplanePathId.toString(),
                startPosition: {
                    x: startPosition.x,
                    y: startPosition.y,
                },
                endPosition: {
                    x: endPosition.x,
                    y: endPosition.y,
                },
            };

            // when
            await useCase.execute(dto);

            // then
            expect(
                mockStrategyCommandRepository.updateAirplanePathPosition
            ).toHaveBeenCalledTimes(1);
            expect(
                mockStrategyCommandRepository.updateAirplanePathPosition
            ).toHaveBeenCalledWith(
                expect.objectContaining({
                    strategyId: strategyId,
                    airplanePathId: airplanePathId,
                    startPosition: startPosition,
                    endPosition: endPosition,
                })
            );
        });
    });

    describe('실패 테스트', () => {
        it('DTO 파싱과정에서 실패하면 에러가 발생하여 Repository에 전달하지도 않는다.', async () => {
            // give
            const dto = {
                strategyId: 'asdf-1234',
                airplanePathId: airplanePathId.toString(),
                startPosition: {
                    x: startPosition.x,
                    y: startPosition.y,
                },
                endPosition: {
                    x: endPosition.x,
                    y: endPosition.y,
                },
            };

            // when & then
            await expect(() => useCase.execute(dto)).rejects.toThrow(
                InvalidEntityIdException
            );

            expect(
                mockStrategyCommandRepository.updateAirplanePathPosition
            ).toHaveBeenCalledTimes(0);
        });
    });

    it('Use Case 내 도메인 호출 과정에서 예외가 발생하면, 예외가 그대로 전파되어야 한다.', async () => {
        // given
        jest.spyOn(
            mockStrategyCommandRepository,
            'updateAirplanePathPosition'
        ).mockImplementation(() => {
            throw new Error();
        });

        const dto = {
            strategyId: strategyId.toString(),
            airplanePathId: airplanePathId.toString(),
            startPosition: {
                x: startPosition.x,
                y: startPosition.y,
            },
            endPosition: {
                x: endPosition.x,
                y: endPosition.y,
            },
        };

        // when & then
        await expect(() => useCase.execute(dto)).rejects.toThrow(Error);
    });
});
