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
import { DeleteTagUseCase } from '@/application/strategy/use-cases/tag/delete-tag.usecase';
import { TagId } from '@domain/strategy/value-objects/tag-id';
import { TagContent } from '@domain/strategy/value-objects/tag-content';
import { StrategyTitle } from '@domain/strategy/value-objects/strategy-title';
import { getStrategyRepositoryMocking } from '@/__tests__/application/helpers/repository-mocking.helpers';

describe('DeleteTagUseCase', () => {
    let useCase: DeleteTagUseCase;
    let mockStrategyRepository: jest.Mocked<StrategyRepositoryPort>;
    let strategyFixture: Strategy;

    const ownerId = UserId.generate();

    let strategyId: StrategyId;
    let tagId: TagId;

    const title = StrategyTitle.create('전략 제목');
    const map = PubgMap.ERANGEL;

    beforeEach(() => {
        mockStrategyRepository = getStrategyRepositoryMocking();

        useCase = new DeleteTagUseCase(mockStrategyRepository);

        strategyFixture = Strategy.create(ownerId, title, map);
        strategyId = strategyFixture.id;

        strategyFixture.addTag(ownerId, TagContent.create('삭제될 내용'));
        tagId = strategyFixture.tags[0].id;
    });

    it('전략을 찾지 못하면, 에러를 던진다.', async () => {
        // given
        mockStrategyRepository.findById.mockResolvedValue(null);
        const dto = {
            actorId: ownerId.toString(),
            strategyId: strategyId.toString(),
            tagId: tagId.toString(),
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
        };

        // when & then
        await expect(() => useCase.execute(dto)).rejects.toThrow(
            TagNotFoundException
        );
        expect(mockStrategyRepository.findById).toHaveBeenCalledTimes(1);
    });

    it('태그가 삭제된다.', async () => {
        // given
        mockStrategyRepository.findById.mockResolvedValue(strategyFixture);

        const dto = {
            actorId: ownerId.toString(),
            strategyId: strategyId.toString(),
            tagId: tagId.toString(),
        };

        // when
        await useCase.execute(dto);

        // then
        expect(mockStrategyRepository.findById).toHaveBeenCalledTimes(1);
        expect(mockStrategyRepository.save).toHaveBeenCalledTimes(1);

        const tag = strategyFixture.tags.find(tag => tag.id.equals(tagId));

        expect(tag).toBeUndefined();
    });

    it('도메인 엔티티에서 에러 발생시 에러를 전파한다', async () => {
        // Given
        jest.spyOn(strategyFixture, 'removeTag').mockImplementation(() => {
            throw new StrategyEditPermissionDeniedException();
        });

        mockStrategyRepository.findById.mockResolvedValue(strategyFixture);

        const dto = {
            actorId: ownerId.toString(),
            strategyId: strategyId.toString(),
            tagId: tagId.toString(),
        };

        // When & Then
        await expect(useCase.execute(dto)).rejects.toThrow(
            StrategyEditPermissionDeniedException
        );
    });
});
