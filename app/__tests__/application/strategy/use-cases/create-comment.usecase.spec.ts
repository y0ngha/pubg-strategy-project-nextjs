import { StrategyRepositoryPort } from '@domain/strategy/port/out/strategy-repository.port';
import {
    DeletedStrategyException,
    StrategyNotFoundException,
} from '@domain/strategy/exceptions/strategy.exceptions';
import { Strategy } from '@domain/strategy/entities/strategy.entity';
import { UserId } from '@domain/shared/value-objects/user-id';
import { StrategyId } from '@domain/strategy/value-objects/strategy-id';
import { PubgMap } from '@domain/strategy/enums/map.enum';
import { CreateCommentUseCase } from '@/application/strategy/use-cases/comment/create-comment.usecase';
import { Email } from '@domain/shared/value-objects/email';
import { StrategyTitle } from '@domain/strategy/value-objects/strategy-title';
import { getStrategyRepositoryMocking } from '@/__tests__/application/helpers/repository-mocking.helpers';

describe('CreateCommentUseCase', () => {
    let useCase: CreateCommentUseCase;
    let mockStrategyRepository: jest.Mocked<StrategyRepositoryPort>;
    let strategyFixture: Strategy;

    const ownerId = UserId.generate();
    const ownerEmail = Email.create('test@domain.com');

    let strategyId: StrategyId;

    const title = StrategyTitle.create('전략 제목');
    const map = PubgMap.ERANGEL;

    beforeEach(() => {
        mockStrategyRepository = getStrategyRepositoryMocking();

        useCase = new CreateCommentUseCase(mockStrategyRepository);

        strategyFixture = Strategy.create(ownerId, title, map);
        strategyId = strategyFixture.id;
    });

    it('전략을 찾지 못하면, 에러를 던진다.', async () => {
        // given
        mockStrategyRepository.findById.mockResolvedValue(null);
        const dto = {
            actorId: ownerId.toString(),
            actorEmail: ownerEmail.toString(),
            strategyId: strategyId.toString(),
            content: '내용입니다.',
            position: {
                x: 10,
                y: 10,
            },
        };

        // when & then
        await expect(() => useCase.execute(dto)).rejects.toThrow(
            StrategyNotFoundException
        );
        expect(mockStrategyRepository.findById).toHaveBeenCalledTimes(1);
    });

    it('댓글이 추가된다.', async () => {
        // given
        mockStrategyRepository.findById.mockResolvedValue(strategyFixture);

        const dto = {
            actorId: ownerId.toString(),
            actorEmail: ownerEmail.toString(),
            strategyId: strategyId.toString(),
            content: '내용입니다.',
            position: {
                x: 10,
                y: 10,
            },
        };

        // when
        await useCase.execute(dto);

        // then
        expect(mockStrategyRepository.findById).toHaveBeenCalledTimes(1);
        expect(mockStrategyRepository.save).toHaveBeenCalledTimes(1);

        const comment = strategyFixture.comments.find(comment =>
            comment?.authorId.equals(ownerId)
        );

        expect(strategyFixture.comments).toHaveLength(1);
        expect(comment?.content.toString()).toEqual(dto.content);
    });

    it('도메인 엔티티에서 예외가 발생하면, 예외가 그대로 전파되어야 한다', async () => {
        // given
        jest.spyOn(strategyFixture, 'addComment').mockImplementation(() => {
            throw new DeletedStrategyException();
        });

        mockStrategyRepository.findById.mockResolvedValue(strategyFixture);

        const dto = {
            actorId: ownerId.toString(),
            actorEmail: ownerEmail.toString(),
            strategyId: strategyId.toString(),
            content: '내용입니다.',
            position: {
                x: 10,
                y: 10,
            },
        };

        //when & then
        await expect(() => useCase.execute(dto)).rejects.toThrow(
            DeletedStrategyException
        );
    });
});
