import { StrategyRepositoryPort } from '@domain/strategy/port/out/strategy-repository.port';
import {
    CommentNotFoundException,
    StrategyNotFoundException,
} from '@domain/strategy/exceptions/strategy.exceptions';
import { Strategy } from '@domain/strategy/entities/strategy.entity';
import { UserId } from '@domain/shared/value-objects/user-id';
import { StrategyId } from '@domain/strategy/value-objects/strategy-id';
import { PubgMap } from '@domain/strategy/enums/map.enum';
import { DeleteCommentUseCase } from '@/application/strategy/use-cases/comment/delete-comment.usecase';
import { CommentId } from '@domain/strategy/value-objects/comment-id';
import { CommentContent } from '@domain/strategy/value-objects/comment-content';
import { Position } from '@domain/strategy/value-objects/position';
import { Email } from '@domain/shared/value-objects/email';
import { StrategyTitle } from '@domain/strategy/value-objects/strategy-title';
import { getStrategyRepositoryMocking } from '@/__tests__/application/helpers/repository-mocking.helpers';

describe('DeleteCommentUseCase', () => {
    let useCase: DeleteCommentUseCase;
    let mockStrategyRepository: jest.Mocked<StrategyRepositoryPort>;
    let strategyFixture: Strategy;

    const ownerId = UserId.generate();
    const ownerEmail = Email.create('test@domain.com');

    let strategyId: StrategyId;
    let commentId: CommentId;

    const title = StrategyTitle.create('전략 제목');
    const map = PubgMap.ERANGEL;

    beforeEach(() => {
        mockStrategyRepository = getStrategyRepositoryMocking();

        useCase = new DeleteCommentUseCase(mockStrategyRepository);

        strategyFixture = Strategy.create(ownerId, title, map);
        strategyId = strategyFixture.id;

        strategyFixture.addComment(
            ownerId,
            ownerEmail,
            CommentContent.create('테스트 댓글'),
            Position.create(10, 10),
            null
        );

        commentId = strategyFixture.comments[0].id;
    });

    it('전략을 찾지 못하면, 에러를 던진다.', async () => {
        // given
        mockStrategyRepository.findById.mockResolvedValue(null);
        const dto = {
            actorId: ownerId.toString(),
            strategyId: strategyId.toString(),
            commentId: commentId.toString(),
        };

        // when & then
        await expect(() => useCase.execute(dto)).rejects.toThrow(
            StrategyNotFoundException
        );
        expect(mockStrategyRepository.findById).toHaveBeenCalledTimes(1);
    });

    it('댓글을 찾지 못하면, 에러를 던진다.', async () => {
        // given
        mockStrategyRepository.findById.mockResolvedValue(strategyFixture);
        const randomId = CommentId.generate();

        const dto = {
            actorId: ownerId.toString(),
            strategyId: strategyId.toString(),
            commentId: randomId.toString(),
        };

        // when & then
        await expect(() => useCase.execute(dto)).rejects.toThrow(
            CommentNotFoundException
        );
        expect(mockStrategyRepository.findById).toHaveBeenCalledTimes(1);
    });

    it('댓글이 삭제된다.', async () => {
        // given
        mockStrategyRepository.findById.mockResolvedValue(strategyFixture);

        const dto = {
            actorId: ownerId.toString(),
            strategyId: strategyId.toString(),
            commentId: commentId.toString(),
        };

        // when
        await useCase.execute(dto);

        // then
        expect(mockStrategyRepository.findById).toHaveBeenCalledTimes(1);
        expect(mockStrategyRepository.save).toHaveBeenCalledTimes(1);

        const comment = strategyFixture.comments.find(comment =>
            comment.id.equals(commentId)
        );

        expect(comment).toBeUndefined();
    });

    it('Use Case 내 도메인 호출 과정에서 예외가 발생하면, 예외가 그대로 전파되어야 한다.', async () => {
        // given
        jest.spyOn(strategyFixture, 'removeComment').mockImplementation(() => {
            throw new CommentNotFoundException();
        });

        mockStrategyRepository.findById.mockResolvedValue(strategyFixture);

        const dto = {
            actorId: ownerId.toString(),
            strategyId: strategyId.toString(),
            commentId: commentId.toString(),
        };

        //when & then
        await expect(() => useCase.execute(dto)).rejects.toThrow(
            CommentNotFoundException
        );
    });
});
