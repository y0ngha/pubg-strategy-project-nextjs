import { DeleteMarkerUseCase } from '@/application/strategy/use-cases/marker/delete-marker.usecase';
import { StrategyId } from '@domain/strategy/value-objects/strategy-id';
import { TeamPlayerId } from '@domain/strategy/value-objects/team-player-id';
import { getStrategyCommandRepositoryMocking } from '@/__tests__/application/helpers/repository-mocking.helpers';
import { StrategyCommandRepositoryPort } from '@domain/strategy/port/repositories/strategy-command-repository.port';
import { InvalidEntityIdException } from '@domain/shared/exceptions/entity-id.exceptions';
import { MarkerId } from '@domain/strategy/value-objects/marker-id';

describe('DeleteMarkerUseCase', () => {
    let useCase: DeleteMarkerUseCase;
    let mockStrategyCommandRepository: jest.Mocked<StrategyCommandRepositoryPort>;

    const strategyId = StrategyId.generate();
    const teamPlayerId = TeamPlayerId.generate();
    const markerId = MarkerId.generate();

    beforeEach(() => {
        mockStrategyCommandRepository = getStrategyCommandRepositoryMocking();

        useCase = new DeleteMarkerUseCase(mockStrategyCommandRepository);
    });

    describe('성공 테스트', () => {
        it('Command를 생성하여 Repository에 전달한다.', async () => {
            // given
            const dto = {
                strategyId: strategyId.toString(),
                teamPlayerId: teamPlayerId.toString(),
                markerId: markerId.toString(),
            };

            // when
            await useCase.execute(dto);

            // then
            expect(
                mockStrategyCommandRepository.deleteMarker
            ).toHaveBeenCalledTimes(1);
            expect(
                mockStrategyCommandRepository.deleteMarker
            ).toHaveBeenCalledWith(
                expect.objectContaining({
                    strategyId: strategyId,
                    teamPlayerId: teamPlayerId,
                    markerId: markerId,
                })
            );
        });
    });

    describe('실패 테스트', () => {
        it('DTO 파싱과정에서 실패하면 에러가 발생하여 Repository에 전달하지도 않는다.', async () => {
            // give
            const dto = {
                strategyId: 'asdf-1234',
                teamPlayerId: teamPlayerId.toString(),
                markerId: markerId.toString(),
            };

            // when & then
            await expect(() => useCase.execute(dto)).rejects.toThrow(
                InvalidEntityIdException
            );

            expect(
                mockStrategyCommandRepository.createMarker
            ).toHaveBeenCalledTimes(0);
        });
    });

    it('Use Case 내 도메인 호출 과정에서 예외가 발생하면, 예외가 그대로 전파되어야 한다.', async () => {
        // given
        jest.spyOn(
            mockStrategyCommandRepository,
            'deleteMarker'
        ).mockImplementation(() => {
            throw new Error();
        });

        const dto = {
            strategyId: strategyId.toString(),
            teamPlayerId: teamPlayerId.toString(),
            markerId: markerId.toString(),
        };

        // when & then
        await expect(() => useCase.execute(dto)).rejects.toThrow(Error);
    });
});
