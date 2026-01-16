import { StrategyRepositoryPort } from '@domain/strategy/port/out/strategy-repository.port';
import {
    ChildCommentException,
    CommentNotFoundException,
    StrategyNotFoundException,
} from '@domain/strategy/exceptions/strategy.exceptions';
import { Strategy } from '@domain/strategy/entities/strategy.entity';
import { UserId } from '@domain/shared/value-objects/user-id';
import { StrategyId } from '@domain/strategy/value-objects/strategy-id';
import { PubgMap } from '@domain/strategy/enums/map.enum';
import { ZodError } from 'zod';
import { CommentId } from '@domain/strategy/value-objects/comment-id';
import { UpdateCommentUseCase } from '@/application/strategy/use-cases/comment/update-comment.usecase';
import { Email } from '@domain/shared/value-objects/email';
import { CommentContent } from '@domain/strategy/value-objects/comment-content';
import { Position } from '@domain/strategy/value-objects/position';
import { StrategyTitle } from '@domain/strategy/value-objects/strategy-title';

describe('UpdateCommentUseCase', () => {
    let useCase: UpdateCommentUseCase;
    let mockStrategyRepository: jest.Mocked<StrategyRepositoryPort>;
    let strategyFixture: Strategy;

    const ownerId = UserId.generate();
    const ownerEmail = Email.create('test@domain.com');

    let strategyId: StrategyId;
    let commentId: CommentId;

    const title = StrategyTitle.create('전략 제목');
    const map = PubgMap.ERANGEL;

    beforeEach(() => {
        mockStrategyRepository = {
            save: jest.fn(),
            delete: jest.fn(),
            findById: jest.fn(),
            findOwnedStrategiesByUserID: jest.fn(),
            findSharedStrategiesByUserID: jest.fn(),
        } as jest.Mocked<StrategyRepositoryPort>;

        useCase = new UpdateCommentUseCase(mockStrategyRepository);

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

    it('댓글을 찾지 못하면, 에러를 던진다.', async () => {
        // given
        mockStrategyRepository.findById.mockResolvedValue(strategyFixture);
        const randomId = CommentId.generate();

        const dto = {
            actorId: ownerId.toString(),
            strategyId: strategyId.toString(),
            commentId: randomId.toString(),
            content: '새로운 내용',
            position: {
                x: 10,
                y: 200,
            },
        };

        // when & then
        await expect(() => useCase.execute(dto)).rejects.toThrow(
            CommentNotFoundException
        );
        expect(mockStrategyRepository.findById).toHaveBeenCalledTimes(1);
    });

    it('댓글이 업데이트 된다.', async () => {
        // given
        mockStrategyRepository.findById.mockResolvedValue(strategyFixture);

        const dto = {
            actorId: ownerId.toString(),
            strategyId: strategyId.toString(),
            commentId: commentId.toString(),
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

        const comment = strategyFixture.comments.find(comment =>
            comment.id.equals(commentId)
        );

        expect(comment?.content.toString()).toEqual(dto.content);
        expect(comment?.position).toEqual(dto.position);
    });

    it('댓글 업데이트시 Content만 보낸다면, Content만 업데이트 된다.', async () => {
        // given
        mockStrategyRepository.findById.mockResolvedValue(strategyFixture);

        const dto = {
            actorId: ownerId.toString(),
            strategyId: strategyId.toString(),
            commentId: commentId.toString(),
            content: '새로운 내용',
        };

        const comment = strategyFixture.comments.find(comment =>
            comment.id.equals(commentId)
        );

        const oldPosition = comment?.position;
        const oldConetnt = comment?.content;

        // when
        await useCase.execute(dto);

        // then
        expect(mockStrategyRepository.findById).toHaveBeenCalledTimes(1);
        expect(mockStrategyRepository.save).toHaveBeenCalledTimes(1);

        expect(comment?.content.toString()).not.toEqual(oldConetnt);
        expect(comment?.content.toString()).toEqual(dto.content);
        expect(comment?.position).toEqual(oldPosition);
    });

    it('댓글 업데이트시 Position만 보낸다면, Position만 업데이트 된다.', async () => {
        // given
        mockStrategyRepository.findById.mockResolvedValue(strategyFixture);

        const dto = {
            actorId: ownerId.toString(),
            strategyId: strategyId.toString(),
            commentId: commentId.toString(),
            position: {
                x: 10,
                y: 200,
            },
        };

        const comment = strategyFixture.comments.find(comment =>
            comment.id.equals(commentId)
        );

        const oldPosition = comment?.position;
        const oldContent = comment?.content;

        // when
        await useCase.execute(dto);

        // then
        expect(mockStrategyRepository.findById).toHaveBeenCalledTimes(1);
        expect(mockStrategyRepository.save).toHaveBeenCalledTimes(1);

        expect(comment?.position).not.toEqual(oldPosition);
        expect(comment?.position).toEqual(dto.position);
        expect(comment?.content.toString()).toEqual(oldContent?.toString());
    });

    it('댓글 업데이트시 업데이트할 속성을 보내지 않으면, 에러를 던진다.', async () => {
        // given
        const dto = {
            actorId: ownerId.toString(),
            strategyId: strategyId.toString(),
            commentId: commentId.toString(),
        };

        // when & then
        await expect(() => useCase.execute(dto)).rejects.toThrow(ZodError);

        // then
        expect(mockStrategyRepository.findById).toHaveBeenCalledTimes(0);
        expect(mockStrategyRepository.save).toHaveBeenCalledTimes(0);
    });

    it('도메인 엔티티에서 예외가 발생하면, 예외가 그대로 전파되어야 한다', async () => {
        // given
        jest.spyOn(strategyFixture, 'updateComment').mockImplementation(() => {
            throw new ChildCommentException();
        });

        mockStrategyRepository.findById.mockResolvedValue(strategyFixture);

        const dto = {
            actorId: ownerId.toString(),
            strategyId: strategyId.toString(),
            commentId: commentId.toString(),
            position: {
                x: 10,
                y: 200,
            },
        };

        //when & then
        await expect(() => useCase.execute(dto)).rejects.toThrow(
            ChildCommentException
        );
    });
});
