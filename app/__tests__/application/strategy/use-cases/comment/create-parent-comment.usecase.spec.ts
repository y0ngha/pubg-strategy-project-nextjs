import { StrategyId } from '@domain/strategy/value-objects/strategy-id';
import { CreateParentCommentUseCase } from '@/application/strategy/use-cases/comment/create-parent-comment.usecase';
import { getStrategyCommandRepositoryMocking } from '@/__tests__/application/helpers/repository-mocking.helpers';
import { Position } from '@domain/strategy/value-objects/position';
import { InvalidEntityIdException } from '@domain/shared/exceptions/entity-id.exceptions';
import { CommentContent } from '@domain/strategy/value-objects/comment-content';
import { StrategyCommandRepositoryPort } from '@domain/strategy/port/repositories/strategy-command-repository.port';
import { CommentId } from '@domain/strategy/value-objects/comment-id';
import { UserId } from '@domain/shared/value-objects/user-id';
import { Email } from '@domain/shared/value-objects/email';

describe('CreateParentCommentUseCase', () => {
    let useCase: CreateParentCommentUseCase;
    let mockStrategyCommandRepository: jest.Mocked<StrategyCommandRepositoryPort>;

    const strategyId = StrategyId.generate();
    const content = CommentContent.create('TEST');
    const position = Position.create(10, 10);

    beforeEach(() => {
        mockStrategyCommandRepository = getStrategyCommandRepositoryMocking();

        useCase = new CreateParentCommentUseCase(mockStrategyCommandRepository);
    });

    describe('성공 테스트', () => {
        it('Command를 생성하여 Repository에 전달한다.', async () => {
            // given
            const dto = {
                strategyId: strategyId.toString(),
                content: content.toString(),
                position: {
                    x: position.x,
                    y: position.y,
                },
            };

            mockStrategyCommandRepository.createParentComment.mockResolvedValue(
                {
                    id: CommentId.generate().toString(),
                    position: dto.position,
                    content: dto.content,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    authorId: UserId.generate().toString(),
                    authorEmail: Email.create('test@domain.com').toString(),
                    parentCommentId: null,
                    isAuthor: true,
                    isParent: true,
                }
            );

            // when
            await useCase.execute(dto);

            // then
            expect(
                mockStrategyCommandRepository.createParentComment
            ).toHaveBeenCalledTimes(1);
            expect(
                mockStrategyCommandRepository.createParentComment
            ).toHaveBeenCalledWith(
                expect.objectContaining({
                    strategyId: strategyId,
                    content: content,
                    position: position,
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
                position: {
                    x: position.x,
                    y: position.y,
                },
            };

            // when & then
            await expect(() => useCase.execute(dto)).rejects.toThrow(
                InvalidEntityIdException
            );

            expect(
                mockStrategyCommandRepository.createParentComment
            ).toHaveBeenCalledTimes(0);
        });
    });

    it('Use Case 내 도메인 호출 과정에서 예외가 발생하면, 예외가 그대로 전파되어야 한다.', async () => {
        // given
        jest.spyOn(
            mockStrategyCommandRepository,
            'createParentComment'
        ).mockImplementation(() => {
            throw new Error();
        });

        const dto = {
            strategyId: strategyId.toString(),
            content: content.toString(),
            position: {
                x: position.x,
                y: position.y,
            },
        };

        // when & then
        await expect(() => useCase.execute(dto)).rejects.toThrow(Error);
    });
});
