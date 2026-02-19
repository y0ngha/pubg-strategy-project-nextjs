import { StrategyId } from '@domain/strategy/value-objects/strategy-id';
import { CommentId } from '@domain/strategy/value-objects/comment-id';
import { UpdateCommentPositionUseCase } from '@/application/strategy/use-cases/comment/update-comment-position.usecase';
import { Position } from '@domain/strategy/value-objects/position';
import { getStrategyCommandRepositoryMocking } from '@/__tests__/application/helpers/repository-mocking.helpers';
import { StrategyCommandRepositoryPort } from '@domain/strategy/port/repositories/strategy-command-repository.port';
import { InvalidEntityIdException } from '@domain/shared/exceptions/entity-id.exceptions';
import { ChildCommentException } from '@domain/strategy/exceptions/strategy.exceptions';

describe('UpdateCommentPositionUseCase', () => {
    let useCase: UpdateCommentPositionUseCase;
    let mockStrategyCommandRepository: jest.Mocked<StrategyCommandRepositoryPort>;

    const strategyId = StrategyId.generate();
    const commentId = CommentId.generate();
    const position = Position.create(10, 10);

    beforeEach(() => {
        mockStrategyCommandRepository = getStrategyCommandRepositoryMocking();

        useCase = new UpdateCommentPositionUseCase(
            mockStrategyCommandRepository
        );
    });

    describe('성공 테스트', () => {
        it('Command를 생성하여 Repository에 전달한다.', async () => {
            // given
            const dto = {
                strategyId: strategyId.toString(),
                commentId: commentId.toString(),
                position: {
                    x: position.x,
                    y: position.y,
                },
                isParent: true,
            };

            // when
            await useCase.execute(dto);

            // then
            expect(
                mockStrategyCommandRepository.updateCommentPosition
            ).toHaveBeenCalledTimes(1);
            expect(
                mockStrategyCommandRepository.updateCommentPosition
            ).toHaveBeenCalledWith(
                expect.objectContaining({
                    strategyId: strategyId,
                    commentId: commentId,
                    position: position,
                })
            );
        });
    });

    describe('실패 테스트', () => {
        it('부모 댓글이 아니라면 에러가 발생하여 Repository에 전달하지도 않는다.', async () => {
            // give
            const dto = {
                strategyId: strategyId.toString(),
                commentId: commentId.toString(),
                position: {
                    x: position.x,
                    y: position.y,
                },
                isParent: false,
            };

            // when & then
            await expect(() => useCase.execute(dto)).rejects.toThrow(
                ChildCommentException
            );

            expect(
                mockStrategyCommandRepository.updateCommentPosition
            ).toHaveBeenCalledTimes(0);
        });

        it('DTO 파싱과정에서 실패하면 에러가 발생하여 Repository에 전달하지도 않는다.', async () => {
            // give
            const dto = {
                strategyId: 'asdf-1234',
                commentId: commentId.toString(),
                position: {
                    x: position.x,
                    y: position.y,
                },
                isParent: true,
            };

            // when & then
            await expect(() => useCase.execute(dto)).rejects.toThrow(
                InvalidEntityIdException
            );

            expect(
                mockStrategyCommandRepository.updateCommentPosition
            ).toHaveBeenCalledTimes(0);
        });
    });

    it('Use Case 내 도메인 호출 과정에서 예외가 발생하면, 예외가 그대로 전파되어야 한다.', async () => {
        // given
        jest.spyOn(
            mockStrategyCommandRepository,
            'updateCommentPosition'
        ).mockImplementation(() => {
            throw new Error();
        });

        const dto = {
            strategyId: strategyId.toString(),
            commentId: commentId.toString(),
            position: {
                x: position.x,
                y: position.y,
            },
            isParent: true,
        };

        // when & then
        await expect(() => useCase.execute(dto)).rejects.toThrow(Error);
    });
});
