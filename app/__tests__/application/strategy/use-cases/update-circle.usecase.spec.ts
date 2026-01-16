import { StrategyRepositoryPort } from '@domain/strategy/port/out/strategy-repository.port';
import {
    CircleNotFoundException,
    StrategyEditPermissionDeniedException,
    StrategyNotFoundException,
} from '@domain/strategy/exceptions/strategy.exceptions';
import { Strategy } from '@domain/strategy/entities/strategy.entity';
import { UserId } from '@domain/shared/value-objects/user-id';
import { StrategyId } from '@domain/strategy/value-objects/strategy-id';
import { PubgMap } from '@domain/strategy/enums/map.enum';
import { CircleId } from '@domain/strategy/value-objects/circle-id';
import { UpdateCircleUseCase } from '@/application/strategy/use-cases/circle/update-circle.usecase';
import { ZodError } from 'zod';
import { StrategyTitle } from '@domain/strategy/value-objects/strategy-title';
import { getStrategyRepositoryMocking } from '@/__tests__/application/helpers/repository-mocking.helpers';

describe('UpdateCircleUseCase', () => {
    let useCase: UpdateCircleUseCase;
    let mockStrategyRepository: jest.Mocked<StrategyRepositoryPort>;
    let strategyFixture: Strategy;

    const ownerId = UserId.generate();

    let strategyId: StrategyId;
    let circleId: CircleId;

    const title = StrategyTitle.create('전략 제목');
    const map = PubgMap.ERANGEL;

    beforeEach(() => {
        mockStrategyRepository = getStrategyRepositoryMocking();

        useCase = new UpdateCircleUseCase(mockStrategyRepository);

        strategyFixture = Strategy.create(ownerId, title, map);
        strategyId = strategyFixture.id;

        strategyFixture.addCircle(ownerId, 1);
        circleId = strategyFixture.circles[0].id;
    });

    it('전략을 찾지 못하면, 에러를 던진다.', async () => {
        // given
        mockStrategyRepository.findById.mockResolvedValue(null);
        const dto = {
            actorId: ownerId.toString(),
            strategyId: strategyId.toString(),
            circleId: circleId.toString(),
            phase: 2,
            centerPosition: {
                x: 10,
                y: 200,
            },
        };

        // when & then
        await expect(() => useCase.execute(dto)).rejects.toThrow(
            StrategyNotFoundException
        );
        expect(mockStrategyRepository.findById).toHaveBeenCalledTimes(1);
    });

    it('자기장을 찾지 못하면, 에러를 던진다.', async () => {
        // given
        mockStrategyRepository.findById.mockResolvedValue(strategyFixture);
        const randomId = CircleId.generate();

        const dto = {
            actorId: ownerId.toString(),
            strategyId: strategyId.toString(),
            circleId: randomId.toString(),
            phase: 2,
            centerPosition: {
                x: 10,
                y: 200,
            },
        };

        // when & then
        await expect(() => useCase.execute(dto)).rejects.toThrow(
            CircleNotFoundException
        );
        expect(mockStrategyRepository.findById).toHaveBeenCalledTimes(1);
    });

    it('자기장이 업데이트 된다.', async () => {
        // given
        mockStrategyRepository.findById.mockResolvedValue(strategyFixture);

        const dto = {
            actorId: ownerId.toString(),
            strategyId: strategyId.toString(),
            circleId: circleId.toString(),
            phase: 2,
            centerPosition: {
                x: 10,
                y: 200,
            },
        };

        // when
        await useCase.execute(dto);

        // then
        expect(mockStrategyRepository.findById).toHaveBeenCalledTimes(1);
        expect(mockStrategyRepository.save).toHaveBeenCalledTimes(1);

        const circle = strategyFixture.circles.find(circle =>
            circle.id.equals(circleId)
        );

        expect(circle?.phase).toEqual(dto.phase);
        expect(circle?.centerPosition).toEqual(dto.centerPosition);
    });

    it('자기장 업데이트시 Phase만 보낸다면, Phase만 업데이트 된다.', async () => {
        // given
        mockStrategyRepository.findById.mockResolvedValue(strategyFixture);

        const dto = {
            actorId: ownerId.toString(),
            strategyId: strategyId.toString(),
            circleId: circleId.toString(),
            phase: 2,
        };

        const circle = strategyFixture.circles.find(circle =>
            circle.id.equals(circleId)
        );

        const oldCenterPosition = circle?.centerPosition;
        const oldPhase = circle?.phase;

        // when
        await useCase.execute(dto);

        // then
        expect(mockStrategyRepository.findById).toHaveBeenCalledTimes(1);
        expect(mockStrategyRepository.save).toHaveBeenCalledTimes(1);

        expect(circle?.phase).not.toEqual(oldPhase);
        expect(circle?.phase).toEqual(dto.phase);
        expect(circle?.centerPosition).toEqual(oldCenterPosition);
    });

    it('자기장 업데이트시 CenterPosition만 보낸다면, CenterPosition만 업데이트 된다.', async () => {
        // given
        mockStrategyRepository.findById.mockResolvedValue(strategyFixture);

        const dto = {
            actorId: ownerId.toString(),
            strategyId: strategyId.toString(),
            circleId: circleId.toString(),
            centerPosition: {
                x: 10,
                y: 200,
            },
        };

        const circle = strategyFixture.circles.find(circle =>
            circle.id.equals(circleId)
        );

        const oldCenterPosition = circle?.centerPosition;
        const oldPhase = circle?.phase;

        // when
        await useCase.execute(dto);

        // then
        expect(mockStrategyRepository.findById).toHaveBeenCalledTimes(1);
        expect(mockStrategyRepository.save).toHaveBeenCalledTimes(1);

        expect(circle?.centerPosition).not.toEqual(oldCenterPosition);
        expect(circle?.centerPosition).toEqual(dto.centerPosition);
        expect(circle?.phase).toEqual(oldPhase);
    });

    it('자기장 업데이트시 업데이트할 속성을 보내지 않으면, 에러를 던진다.', async () => {
        // given
        const dto = {
            actorId: ownerId.toString(),
            strategyId: strategyId.toString(),
            circleId: circleId.toString(),
        };

        // when & then
        await expect(() => useCase.execute(dto)).rejects.toThrow(ZodError);

        // then
        expect(mockStrategyRepository.findById).toHaveBeenCalledTimes(0);
        expect(mockStrategyRepository.save).toHaveBeenCalledTimes(0);
    });

    it('도메인 엔티티에서 에러 발생시 에러를 전파한다', async () => {
        // Given
        jest.spyOn(strategyFixture, 'updateCircle').mockImplementation(() => {
            throw new StrategyEditPermissionDeniedException();
        });

        mockStrategyRepository.findById.mockResolvedValue(strategyFixture);

        const dto = {
            actorId: ownerId.toString(),
            strategyId: strategyId.toString(),
            circleId: circleId.toString(),
            centerPosition: {
                x: 10,
                y: 200,
            },
        };

        // When & Then
        await expect(useCase.execute(dto)).rejects.toThrow(
            StrategyEditPermissionDeniedException
        );
    });
});
