import { StrategyRepositoryPort } from '@domain/strategy/port/out/strategy-repository.port';
import {
    AirplanePathNotFoundException,
    StrategyEditPermissionDeniedException,
    StrategyNotFoundException,
} from '@domain/strategy/exceptions/strategy.exceptions';
import { Strategy } from '@domain/strategy/entities/strategy.entity';
import { UserId } from '@domain/shared/value-objects/user-id';
import { StrategyId } from '@domain/strategy/value-objects/strategy-id';
import { PubgMap } from '@domain/strategy/enums/map.enum';
import { UpdateAirplanePathUseCase } from '@/application/strategy/use-cases/airplane-path/update-airplane-path.usecase';
import { Position } from '@domain/strategy/value-objects/position';
import { StrategyTitle } from '@domain/strategy/value-objects/strategy-title';
import { getStrategyRepositoryMocking } from '@/__tests__/application/helpers/repository-mocking.helpers';
import { Email } from '@domain/shared/value-objects/email';
import { AirplanePathId } from '@domain/strategy/value-objects/airplane-path-id';

describe('UpdateAirplanePathUseCase', () => {
    let useCase: UpdateAirplanePathUseCase;
    let mockStrategyRepository: jest.Mocked<StrategyRepositoryPort>;
    let strategyFixture: Strategy;

    const ownerId = UserId.generate();
    const ownerEmail = Email.create('test@domain.com');

    let strategyId: StrategyId;
    let airplanePathId: AirplanePathId;

    const title = StrategyTitle.create('전략 제목');
    const map = PubgMap.ERANGEL;

    beforeEach(() => {
        mockStrategyRepository = getStrategyRepositoryMocking();

        useCase = new UpdateAirplanePathUseCase(mockStrategyRepository);

        strategyFixture = Strategy.create(ownerId, ownerEmail, title, map);
        const airplanePath = strategyFixture.addAirplanePath(
            ownerId,
            Position.create(1000, 1000),
            Position.create(5000, 5000)
        );

        strategyId = strategyFixture.id;
        airplanePathId = airplanePath.id;
    });

    it('전략을 찾지 못하면, 에러를 던진다.', async () => {
        // given
        mockStrategyRepository.findById.mockResolvedValue(null);
        const dto = {
            actorId: ownerId.toString(),
            strategyId: strategyId.toString(),
            airplanePathId: airplanePathId.toString(),
            startPosition: {
                x: 10,
                y: 10,
            },
            endPosition: {
                x: 100,
                y: 100,
            },
        };

        // when & then
        await expect(() => useCase.execute(dto)).rejects.toThrow(
            StrategyNotFoundException
        );
        expect(mockStrategyRepository.findById).toHaveBeenCalledTimes(1);
    });

    it('비행기 동선을 찾지 못하면, 에러를 던진다.', async () => {
        // given
        mockStrategyRepository.findById.mockResolvedValue(strategyFixture);
        const randomId = AirplanePathId.generate();

        const dto = {
            actorId: ownerId.toString(),
            strategyId: strategyId.toString(),
            airplanePathId: randomId.toString(),
            startPosition: {
                x: 10,
                y: 10,
            },
            endPosition: {
                x: 100,
                y: 100,
            },
        };

        // when & then
        await expect(() => useCase.execute(dto)).rejects.toThrow(
            AirplanePathNotFoundException
        );
        expect(mockStrategyRepository.findById).toHaveBeenCalledTimes(1);
    });

    it('비행기 동선이 수정된다.', async () => {
        // given
        mockStrategyRepository.findById.mockResolvedValue(strategyFixture);

        const dto = {
            actorId: ownerId.toString(),
            strategyId: strategyId.toString(),
            airplanePathId: airplanePathId.toString(),
            startPosition: {
                x: 10,
                y: 10,
            },
            endPosition: {
                x: 100,
                y: 100,
            },
        };

        // when
        await useCase.execute(dto);

        // then
        expect(mockStrategyRepository.findById).toHaveBeenCalledTimes(1);
        expect(mockStrategyRepository.save).toHaveBeenCalledTimes(1);

        expect(strategyFixture.airplanePath).not.toBeNull();
        expect(strategyFixture.airplanePath?.startPosition).toEqual(
            dto.startPosition
        );
        expect(strategyFixture.airplanePath?.endPosition).toEqual(
            dto.endPosition
        );
    });

    it('Use Case 내 도메인 호출 과정에서 예외가 발생하면, 예외가 그대로 전파되어야 한다.', async () => {
        // Given
        jest.spyOn(strategyFixture, 'updateAirplanePath').mockImplementation(
            () => {
                throw new StrategyEditPermissionDeniedException();
            }
        );

        mockStrategyRepository.findById.mockResolvedValue(strategyFixture);

        const dto = {
            actorId: ownerId.toString(),
            strategyId: strategyId.toString(),
            airplanePathId: airplanePathId.toString(),
            startPosition: {
                x: 10,
                y: 10,
            },
            endPosition: {
                x: 100,
                y: 100,
            },
        };

        // When & Then
        await expect(useCase.execute(dto)).rejects.toThrow(
            StrategyEditPermissionDeniedException
        );
    });
});
