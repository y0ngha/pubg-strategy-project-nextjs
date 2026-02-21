import { StrategyId } from '@domain/strategy/value-objects/strategy-id';
import { DeleteAirplanePathUseCase } from '@/application/strategy/use-cases/airplane-path/delete-airplane-path.usecase';
import { AirplanePathId } from '@domain/strategy/value-objects/airplane-path-id';
import { StrategyCommandRepositoryPort } from '@domain/strategy/port/repositories/strategy-command-repository.port';
import { getStrategyCommandRepositoryMocking } from '@/__tests__/application/helpers/repository-mocking.helpers';
import { InvalidEntityIdException } from '@domain/shared/exceptions/entity-id.exceptions';

describe('DeleteAirplanePathUseCase', () => {
    let useCase: DeleteAirplanePathUseCase;
    let mockStrategyCommandRepository: jest.Mocked<StrategyCommandRepositoryPort>;

    const strategyId = StrategyId.generate();
    const airplanePathId = AirplanePathId.generate();

    beforeEach(() => {
        mockStrategyCommandRepository = getStrategyCommandRepositoryMocking();

        useCase = new DeleteAirplanePathUseCase(mockStrategyCommandRepository);
    });

    describe('성공 테스트', () => {
        it('Command를 생성하여 Repository에 전달한다.', async () => {
            // given
            const dto = {
                strategyId: strategyId.toString(),
                airplanePathId: airplanePathId.toString(),
            };

            // when
            await useCase.execute(dto);

            // then
            expect(
                mockStrategyCommandRepository.deleteAirplanePath
            ).toHaveBeenCalledTimes(1);
            expect(
                mockStrategyCommandRepository.deleteAirplanePath
            ).toHaveBeenCalledWith(
                expect.objectContaining({
                    strategyId: strategyId,
                    airplanePathId: airplanePathId,
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
            };

            // when & then
            await expect(() => useCase.execute(dto)).rejects.toThrow(
                InvalidEntityIdException
            );

            expect(
                mockStrategyCommandRepository.deleteAirplanePath
            ).toHaveBeenCalledTimes(0);
        });
    });

    it('Use Case 내 도메인 호출 과정에서 예외가 발생하면, 예외가 그대로 전파되어야 한다.', async () => {
        // given
        jest.spyOn(
            mockStrategyCommandRepository,
            'deleteAirplanePath'
        ).mockImplementation(() => {
            throw new Error();
        });

        const dto = {
            strategyId: strategyId.toString(),
            airplanePathId: airplanePathId.toString(),
        };

        // when & then
        await expect(() => useCase.execute(dto)).rejects.toThrow(Error);
    });
});
