import { StrategyId } from '@domain/strategy/value-objects/strategy-id';
import { TeamPlayerId } from '@domain/strategy/value-objects/team-player-id';
import { AddWaypointUseCase } from '@/application/strategy/use-cases/waypoint/add-waypoint.usecase';
import { getStrategyCommandRepositoryMocking } from '@/__tests__/application/helpers/repository-mocking.helpers';
import { Position } from '@domain/strategy/value-objects/position';
import { StrategyCommandRepositoryPort } from '@domain/strategy/port/repositories/strategy-command-repository.port';
import { MarkerId } from '@domain/strategy/value-objects/marker-id';
import { InvalidEntityIdException } from '@domain/shared/exceptions/entity-id.exceptions';
import { WaypointPositions } from '@domain/strategy/value-objects/waypoint-positions';

describe('AddWaypointUseCase', () => {
    let useCase: AddWaypointUseCase;
    let mockStrategyCommandRepository: jest.Mocked<StrategyCommandRepositoryPort>;

    const strategyId = StrategyId.generate();
    const teamPlayerId = TeamPlayerId.generate();
    const positions = WaypointPositions.create([Position.create(10, 10)]);

    beforeEach(() => {
        mockStrategyCommandRepository = getStrategyCommandRepositoryMocking();

        useCase = new AddWaypointUseCase(mockStrategyCommandRepository);
    });

    describe('성공 테스트', () => {
        it('Command를 생성하여 Repository에 전달한다.', async () => {
            // given
            const dto = {
                strategyId: strategyId.toString(),
                teamPlayerId: teamPlayerId.toString(),
                positions: positions.values.map(position => {
                    return { x: position.x, y: position.y };
                }),
            };

            mockStrategyCommandRepository.createWaypoint.mockResolvedValue({
                id: MarkerId.generate().toString(),
                positions: dto.positions,
                createdAt: new Date(),
                updatedAt: new Date(),
            });

            // when
            await useCase.execute(dto);

            // then
            expect(
                mockStrategyCommandRepository.createWaypoint
            ).toHaveBeenCalledTimes(1);
            expect(
                mockStrategyCommandRepository.createWaypoint
            ).toHaveBeenCalledWith(
                expect.objectContaining({
                    strategyId: strategyId,
                    teamPlayerId: teamPlayerId,
                    positions: positions,
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
                positions: positions.values.map(position => {
                    return { x: position.x, y: position.y };
                }),
            };

            // when & then
            await expect(() => useCase.execute(dto)).rejects.toThrow(
                InvalidEntityIdException
            );

            expect(
                mockStrategyCommandRepository.createWaypoint
            ).toHaveBeenCalledTimes(0);
        });
    });

    it('Use Case 내 도메인 호출 과정에서 예외가 발생하면, 예외가 그대로 전파되어야 한다.', async () => {
        // given
        jest.spyOn(
            mockStrategyCommandRepository,
            'createWaypoint'
        ).mockImplementation(() => {
            throw new Error();
        });

        const dto = {
            strategyId: strategyId.toString(),
            teamPlayerId: teamPlayerId.toString(),
            positions: positions.values.map(position => {
                return { x: position.x, y: position.y };
            }),
        };

        // when & then
        await expect(() => useCase.execute(dto)).rejects.toThrow(Error);
    });
});
