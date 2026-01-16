import { StrategyRepositoryPort } from '@domain/strategy/port/out/strategy-repository.port';
import {
    StrategyNotFoundException,
    StrategyPermissionDeniedException,
} from '@domain/strategy/exceptions/strategy.exceptions';
import { Strategy } from '@domain/strategy/entities/strategy.entity';
import { UserId } from '@domain/shared/value-objects/user-id';
import { StrategyId } from '@domain/strategy/value-objects/strategy-id';
import { PubgMap } from '@domain/strategy/enums/map.enum';

import { ZodError } from 'zod';
import { UpdateStrategyUseCase } from '@/application/strategy/use-cases/update-strategy.usecase';
import { StrategyTitle } from '@domain/strategy/value-objects/strategy-title';
import { getStrategyRepositoryMocking } from '@/__tests__/application/helpers/repository-mocking.helpers';

describe('UpdateStrategyUseCase', () => {
    let useCase: UpdateStrategyUseCase;
    let mockStrategyRepository: jest.Mocked<StrategyRepositoryPort>;
    let strategyFixture: Strategy;

    const ownerId = UserId.generate();

    let strategyId: StrategyId;

    const initialTitle = StrategyTitle.create('전략 제목');
    const initialMap = PubgMap.ERANGEL;

    beforeEach(() => {
        mockStrategyRepository = getStrategyRepositoryMocking();

        useCase = new UpdateStrategyUseCase(mockStrategyRepository);

        strategyFixture = Strategy.create(ownerId, initialTitle, initialMap);
        strategyId = strategyFixture.id;
    });

    it('전략을 찾지 못하면, 에러를 던진다.', async () => {
        // given
        mockStrategyRepository.findById.mockResolvedValue(null);
        const dto = {
            actorId: ownerId.toString(),
            strategyId: strategyId.toString(),
            title: '변경된 제목',
            map: PubgMap.DESTON,
        };

        // when & then
        await expect(() => useCase.execute(dto)).rejects.toThrow(
            StrategyNotFoundException
        );
        expect(mockStrategyRepository.findById).toHaveBeenCalledTimes(1);
    });

    it('전략이 업데이트 된다.', async () => {
        // given
        mockStrategyRepository.findById.mockResolvedValue(strategyFixture);

        const dto = {
            actorId: ownerId.toString(),
            strategyId: strategyId.toString(),
            title: '변경된 제목',
            map: PubgMap.DESTON,
        };

        // when
        await useCase.execute(dto);

        // then
        expect(mockStrategyRepository.findById).toHaveBeenCalledTimes(1);
        expect(mockStrategyRepository.save).toHaveBeenCalledTimes(1);

        expect(strategyFixture.title.toString()).toEqual(dto.title);
        expect(strategyFixture.map).toEqual(dto.map);
    });

    it('전략 업데이트시 Title만 보낸다면, Title만 업데이트 된다.', async () => {
        // given
        mockStrategyRepository.findById.mockResolvedValue(strategyFixture);

        const dto = {
            actorId: ownerId.toString(),
            strategyId: strategyId.toString(),
            title: '변경된 제목',
        };

        const oldMap = strategyFixture.map;
        const oldTitle = strategyFixture.title;

        // when
        await useCase.execute(dto);

        // then
        expect(mockStrategyRepository.findById).toHaveBeenCalledTimes(1);
        expect(mockStrategyRepository.save).toHaveBeenCalledTimes(1);

        expect(strategyFixture.title).not.toEqual(oldTitle);
        expect(strategyFixture.title.toString()).toEqual(dto.title);
        expect(strategyFixture.map).toEqual(oldMap);
    });

    it('전략 업데이트시 Map만 보낸다면, Map만 업데이트 된다.', async () => {
        // given
        mockStrategyRepository.findById.mockResolvedValue(strategyFixture);

        const dto = {
            actorId: ownerId.toString(),
            strategyId: strategyId.toString(),
            map: PubgMap.DESTON,
        };

        const oldMap = strategyFixture.map;
        const oldTitle = strategyFixture.title;

        // when
        await useCase.execute(dto);

        // then
        expect(mockStrategyRepository.findById).toHaveBeenCalledTimes(1);
        expect(mockStrategyRepository.save).toHaveBeenCalledTimes(1);

        expect(strategyFixture.map).not.toEqual(oldMap);
        expect(strategyFixture.map).toEqual(dto.map);
        expect(strategyFixture.title).toEqual(oldTitle);
    });

    it('전략 업데이트시 업데이트할 속성을 보내지 않으면, 에러를 던진다.', async () => {
        // given
        const dto = {
            actorId: ownerId.toString(),
            strategyId: strategyId.toString(),
        };

        // when & then
        await expect(() => useCase.execute(dto)).rejects.toThrow(ZodError);

        // then
        expect(mockStrategyRepository.findById).toHaveBeenCalledTimes(0);
        expect(mockStrategyRepository.save).toHaveBeenCalledTimes(0);
    });

    it('도메인 엔티티에서 예외가 발생하면, 예외가 그대로 전파되어야 한다', async () => {
        // given
        jest.spyOn(strategyFixture, 'update').mockImplementation(() => {
            throw new StrategyPermissionDeniedException();
        });

        mockStrategyRepository.findById.mockResolvedValue(strategyFixture);

        const dto = {
            actorId: ownerId.toString(),
            strategyId: strategyId.toString(),
            title: '변경된 제목',
            map: PubgMap.DESTON,
        };

        //when & then
        await expect(() => useCase.execute(dto)).rejects.toThrow(
            StrategyPermissionDeniedException
        );
    });
});
