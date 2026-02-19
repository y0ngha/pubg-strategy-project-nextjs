import { CreateCircleUseCase } from '@/application/strategy/use-cases/circle/create-circle.usecase';
import { getStrategyCommandRepositoryMocking } from '@/__tests__/application/helpers/repository-mocking.helpers';
import { StrategyCommandRepositoryPort } from '@domain/strategy/port/repositories/strategy-command-repository.port';
import { StrategyId } from '@domain/strategy/value-objects/strategy-id';
import { Position } from '@domain/strategy/value-objects/position';
import { InvalidEntityIdException } from '@domain/shared/exceptions/entity-id.exceptions';
import { CirclePhase } from '@domain/strategy/value-objects/circle-phase';
import { CircleId } from '@domain/strategy/value-objects/circle-id';

describe('CreateCircleUseCase', () => {
    let useCase: CreateCircleUseCase;
    let mockStrategyCommandRepository: jest.Mocked<StrategyCommandRepositoryPort>;

    beforeEach(() => {
        mockStrategyCommandRepository = getStrategyCommandRepositoryMocking();

        useCase = new CreateCircleUseCase(mockStrategyCommandRepository);
    });

    const strategyId = StrategyId.generate();
    const phase = CirclePhase.create(1);
    const centerPosition = Position.create(10, 10);

    beforeEach(() => {
        mockStrategyCommandRepository = getStrategyCommandRepositoryMocking();

        useCase = new CreateCircleUseCase(mockStrategyCommandRepository);
    });

    describe('성공 테스트', () => {
        it('Command를 생성하여 Repository에 전달한다.', async () => {
            // given
            const dto = {
                strategyId: strategyId.toString(),
                phase: phase.value,
                position: {
                    x: centerPosition.x,
                    y: centerPosition.y,
                },
            };

            mockStrategyCommandRepository.createCircle.mockResolvedValue({
                id: CircleId.generate().toString(),
                phase: dto.phase,
                centerPosition: dto.position,
                createdAt: new Date(),
                updatedAt: new Date(),
            });

            // when
            await useCase.execute(dto);

            // then
            expect(
                mockStrategyCommandRepository.createCircle
            ).toHaveBeenCalledTimes(1);
            expect(
                mockStrategyCommandRepository.createCircle
            ).toHaveBeenCalledWith(
                expect.objectContaining({
                    strategyId: strategyId,
                    phase: phase,
                    centerPosition: centerPosition,
                })
            );
        });
    });

    describe('실패 테스트', () => {
        it('DTO 파싱과정에서 실패하면 에러가 발생하여 Repository에 전달하지도 않는다.', async () => {
            // give
            const dto = {
                strategyId: 'asdf-1234',
                phase: phase.value,
                position: {
                    x: centerPosition.x,
                    y: centerPosition.y,
                },
            };

            // when & then
            await expect(() => useCase.execute(dto)).rejects.toThrow(
                InvalidEntityIdException
            );

            expect(
                mockStrategyCommandRepository.createCircle
            ).toHaveBeenCalledTimes(0);
        });
    });

    it('Use Case 내 도메인 호출 과정에서 예외가 발생하면, 예외가 그대로 전파되어야 한다.', async () => {
        // given
        jest.spyOn(
            mockStrategyCommandRepository,
            'createCircle'
        ).mockImplementation(() => {
            throw new Error();
        });

        const dto = {
            strategyId: strategyId.toString(),
            phase: phase.value,
            position: {
                x: centerPosition.x,
                y: centerPosition.y,
            },
        };

        // when & then
        await expect(() => useCase.execute(dto)).rejects.toThrow(Error);
    });
});
