import { StrategyRepositoryPort } from '@domain/strategy/port/out/strategy-repository.port';
import {
    StrategyEditPermissionDeniedException,
    StrategyNotFoundException,
    TagNotFoundException,
} from '@domain/strategy/exceptions/strategy.exceptions';
import { Strategy } from '@domain/strategy/entities/strategy.entity';
import { UserId } from '@domain/shared/value-objects/user-id';
import { StrategyId } from '@domain/strategy/value-objects/strategy-id';
import { PubgMap } from '@domain/strategy/enums/map.enum';
import { TagId } from '@domain/strategy/value-objects/tag-id';
import { UpdateTagUseCase } from '@/application/strategy/use-cases/tag/update-tag.usecase';
import { ZodError } from 'zod';
import { TagContent } from '@domain/strategy/value-objects/tag-content';
import { StrategyTitle } from '@domain/strategy/value-objects/strategy-title';
import { getStrategyRepositoryMocking } from '@/__tests__/application/helpers/repository-mocking.helpers';

describe('UpdateTagUseCase', () => {
    let useCase: UpdateTagUseCase;
    let mockStrategyRepository: jest.Mocked<StrategyRepositoryPort>;
    let strategyFixture: Strategy;

    const ownerId = UserId.generate();

    let strategyId: StrategyId;
    let tagId: TagId;

    const title = StrategyTitle.create('전략 제목');
    const map = PubgMap.ERANGEL;

    beforeEach(() => {
        mockStrategyRepository = getStrategyRepositoryMocking();

        useCase = new UpdateTagUseCase(mockStrategyRepository);

        strategyFixture = Strategy.create(ownerId, title, map);
        strategyId = strategyFixture.id;

        strategyFixture.addTag(ownerId, TagContent.create('업데이트 될 내용'));
        tagId = strategyFixture.tags[0].id;
    });

    it('전략을 찾지 못하면, 에러를 던진다.', async () => {
        // given
        mockStrategyRepository.findById.mockResolvedValue(null);
        const dto = {
            actorId: ownerId.toString(),
            strategyId: strategyId.toString(),
            tagId: tagId.toString(),
            content: '새로운 내용',
            position: {
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

    it('태그를 찾지 못하면, 에러를 던진다.', async () => {
        // given
        mockStrategyRepository.findById.mockResolvedValue(strategyFixture);
        const randomId = TagId.generate();

        const dto = {
            actorId: ownerId.toString(),
            strategyId: strategyId.toString(),
            tagId: randomId.toString(),
            content: '새로운 내용',
            position: {
                x: 10,
                y: 200,
            },
        };

        // when & then
        await expect(() => useCase.execute(dto)).rejects.toThrow(
            TagNotFoundException
        );
        expect(mockStrategyRepository.findById).toHaveBeenCalledTimes(1);
    });

    it('태그가 업데이트 된다.', async () => {
        // given
        mockStrategyRepository.findById.mockResolvedValue(strategyFixture);

        const dto = {
            actorId: ownerId.toString(),
            strategyId: strategyId.toString(),
            tagId: tagId.toString(),
            content: '새로운 내용',
            position: {
                x: 10,
                y: 200,
            },
        };

        // when
        await useCase.execute(dto);

        // then
        expect(mockStrategyRepository.findById).toHaveBeenCalledTimes(1);
        expect(mockStrategyRepository.save).toHaveBeenCalledTimes(1);

        const tag = strategyFixture.tags.find(tag => tag.id.equals(tagId));

        expect(tag?.content.toString()).toEqual(dto.content);
        expect(tag?.position).toEqual(dto.position);
    });

    it('태그 업데이트시 Content만 보낸다면, Content만 업데이트 된다.', async () => {
        // given
        mockStrategyRepository.findById.mockResolvedValue(strategyFixture);

        const dto = {
            actorId: ownerId.toString(),
            strategyId: strategyId.toString(),
            tagId: tagId.toString(),
            content: '새로운 내용',
        };

        const tag = strategyFixture.tags.find(tag => tag.id.equals(tagId));

        const oldPosition = tag?.position;
        const oldConetnt = tag?.content;

        // when
        await useCase.execute(dto);

        // then
        expect(mockStrategyRepository.findById).toHaveBeenCalledTimes(1);
        expect(mockStrategyRepository.save).toHaveBeenCalledTimes(1);

        expect(tag?.content.toString()).not.toEqual(oldConetnt);
        expect(tag?.content.toString()).toEqual(dto.content);
        expect(tag?.position).toEqual(oldPosition);
    });

    it('태그 업데이트시 Position만 보낸다면, Position만 업데이트 된다.', async () => {
        // given
        mockStrategyRepository.findById.mockResolvedValue(strategyFixture);

        const dto = {
            actorId: ownerId.toString(),
            strategyId: strategyId.toString(),
            tagId: tagId.toString(),
            position: {
                x: 10,
                y: 200,
            },
        };

        const tag = strategyFixture.tags.find(tag => tag.id.equals(tagId));

        const oldPosition = tag?.position;
        const oldContent = tag?.content;

        // when
        await useCase.execute(dto);

        // then
        expect(mockStrategyRepository.findById).toHaveBeenCalledTimes(1);
        expect(mockStrategyRepository.save).toHaveBeenCalledTimes(1);

        expect(tag?.position).not.toEqual(oldPosition);
        expect(tag?.position).toEqual(dto.position);
        expect(tag?.content.toString()).toEqual(oldContent?.toString());
    });

    it('태그 업데이트시 업데이트할 속성을 보내지 않으면, 에러를 던진다.', async () => {
        // given
        const dto = {
            actorId: ownerId.toString(),
            strategyId: strategyId.toString(),
            tagId: tagId.toString(),
        };

        // when & then
        await expect(() => useCase.execute(dto)).rejects.toThrow(ZodError);

        // then
        expect(mockStrategyRepository.findById).toHaveBeenCalledTimes(0);
        expect(mockStrategyRepository.save).toHaveBeenCalledTimes(0);
    });

    it('도메인 엔티티에서 에러 발생시 에러를 전파한다', async () => {
        // Given
        jest.spyOn(strategyFixture, 'updateTag').mockImplementation(() => {
            throw new StrategyEditPermissionDeniedException();
        });

        mockStrategyRepository.findById.mockResolvedValue(strategyFixture);

        const dto = {
            actorId: ownerId.toString(),
            strategyId: strategyId.toString(),
            tagId: tagId.toString(),
            position: {
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
