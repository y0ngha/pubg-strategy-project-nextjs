import { StrategyId } from '@domain/strategy/value-objects/strategy-id';
import { CommentId } from '@domain/strategy/value-objects/comment-id';
import { getStrategyCommandRepositoryMocking } from '@/__tests__/application/helpers/repository-mocking.helpers';
import { StrategyCommandRepositoryPort } from '@domain/strategy/port/repositories/strategy-command-repository.port';
import { InvalidEntityIdException } from '@domain/shared/exceptions/entity-id.exceptions';
import { CommentContent } from '@domain/strategy/value-objects/comment-content';
import { UpdateCommentContentUseCase } from '@/application/strategy/use-cases/comment/update-comment-content.usecase';

describe('UpdateCommentContentUseCase', () => {
    let useCase: UpdateCommentContentUseCase;
    let mockStrategyCommandRepository: jest.Mocked<StrategyCommandRepositoryPort>;

    const strategyId = StrategyId.generate();
    const commentId = CommentId.generate();
    const content = CommentContent.create('TEST');

    beforeEach(() => {
        mockStrategyCommandRepository = getStrategyCommandRepositoryMocking();

        useCase = new UpdateCommentContentUseCase(
            mockStrategyCommandRepository
        );
    });

    describe('성공 테스트', () => {
        it('Command를 생성하여 Repository에 전달한다.', async () => {
            // given
            const dto = {
                strategyId: strategyId.toString(),
                commentId: commentId.toString(),
                content: content.toString(),
            };

            // when
            await useCase.execute(dto);

            // then
            expect(
                mockStrategyCommandRepository.updateCommentContent
            ).toHaveBeenCalledTimes(1);
            expect(
                mockStrategyCommandRepository.updateCommentContent
            ).toHaveBeenCalledWith(
                expect.objectContaining({
                    strategyId: strategyId,
                    commentId: commentId,
                    content: content,
                })
            );
        });
    });

    describe('실패 테스트', () => {
        it('DTO 파싱과정에서 실패하면 에러가 발생하여 Repository에 전달하지도 않는다.', async () => {
            // give
            const dto = {
                strategyId: 'asdf-1234',
                commentId: commentId.toString(),
                content: content.toString(),
            };

            // when & then
            await expect(() => useCase.execute(dto)).rejects.toThrow(
                InvalidEntityIdException
            );

            expect(
                mockStrategyCommandRepository.updateCommentContent
            ).toHaveBeenCalledTimes(0);
        });
    });

    it('Use Case 내 도메인 호출 과정에서 예외가 발생하면, 예외가 그대로 전파되어야 한다.', async () => {
        // given
        jest.spyOn(
            mockStrategyCommandRepository,
            'updateCommentContent'
        ).mockImplementation(() => {
            throw new Error();
        });

        const dto = {
            strategyId: strategyId.toString(),
            commentId: commentId.toString(),
            content: content.toString(),
        };

        // when & then
        await expect(() => useCase.execute(dto)).rejects.toThrow(Error);
    });
});
