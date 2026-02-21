import { StrategyId } from '@domain/strategy/value-objects/strategy-id';
import { getStrategyCommandRepositoryMocking } from '@/__tests__/application/helpers/repository-mocking.helpers';
import { InvalidEntityIdException } from '@domain/shared/exceptions/entity-id.exceptions';
import { CommentContent } from '@domain/strategy/value-objects/comment-content';
import { StrategyCommandRepositoryPort } from '@domain/strategy/port/repositories/strategy-command-repository.port';
import { CommentId } from '@domain/strategy/value-objects/comment-id';
import { UserId } from '@domain/shared/value-objects/user-id';
import { Email } from '@domain/shared/value-objects/email';
import { CreateChildCommentUseCase } from '@/application/strategy/use-cases/comment/create-child-comment.usecase';

describe('CreateChildCommentUseCase', () => {
    let useCase: CreateChildCommentUseCase;
    let mockStrategyCommandRepository: jest.Mocked<StrategyCommandRepositoryPort>;

    const strategyId = StrategyId.generate();
    const content = CommentContent.create('TEST');
    const parentCommentId = CommentId.generate();

    beforeEach(() => {
        mockStrategyCommandRepository = getStrategyCommandRepositoryMocking();

        useCase = new CreateChildCommentUseCase(mockStrategyCommandRepository);
    });

    describe('성공 테스트', () => {
        it('Command를 생성하여 Repository에 전달한다.', async () => {
            // given
            const dto = {
                strategyId: strategyId.toString(),
                content: content.toString(),
                parentCommentId: parentCommentId.toString(),
            };

            mockStrategyCommandRepository.createChildComment.mockResolvedValue({
                id: CommentId.generate().toString(),
                position: null,
                content: dto.content,
                createdAt: new Date(),
                updatedAt: new Date(),
                authorId: UserId.generate().toString(),
                authorEmail: Email.create('test@domain.com').toString(),
                parentCommentId: dto.parentCommentId,
                isAuthor: true,
                isParent: false,
            });

            // when
            await useCase.execute(dto);

            // then
            expect(
                mockStrategyCommandRepository.createChildComment
            ).toHaveBeenCalledTimes(1);
            expect(
                mockStrategyCommandRepository.createChildComment
            ).toHaveBeenCalledWith(
                expect.objectContaining({
                    strategyId: strategyId,
                    content: content,
                    parentCommentId: parentCommentId,
                })
            );
        });
    });

    describe('실패 테스트', () => {
        it('DTO 파싱과정에서 실패하면 에러가 발생하여 Repository에 전달하지도 않는다.', async () => {
            // give
            const dto = {
                strategyId: 'asdf-1234',
                content: content.toString(),
                parentCommentId: parentCommentId.toString(),
            };

            // when & then
            await expect(() => useCase.execute(dto)).rejects.toThrow(
                InvalidEntityIdException
            );

            expect(
                mockStrategyCommandRepository.createChildComment
            ).toHaveBeenCalledTimes(0);
        });
    });

    it('Use Case 내 도메인 호출 과정에서 예외가 발생하면, 예외가 그대로 전파되어야 한다.', async () => {
        // given
        jest.spyOn(
            mockStrategyCommandRepository,
            'createChildComment'
        ).mockImplementation(() => {
            throw new Error();
        });

        const dto = {
            strategyId: strategyId.toString(),
            content: content.toString(),
            parentCommentId: parentCommentId.toString(),
        };

        // when & then
        await expect(() => useCase.execute(dto)).rejects.toThrow(Error);
    });
});
