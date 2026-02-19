import { StrategyId } from '@domain/strategy/value-objects/strategy-id';
import { CreateTagUseCase } from '@/application/strategy/use-cases/tag/create-tag.usecase';
import { getStrategyCommandRepositoryMocking } from '@/__tests__/application/helpers/repository-mocking.helpers';
import { StrategyCommandRepositoryPort } from '@domain/strategy/port/repositories/strategy-command-repository.port';
import { Position } from '@domain/strategy/value-objects/position';
import { InvalidEntityIdException } from '@domain/shared/exceptions/entity-id.exceptions';
import { TagContent } from '@domain/strategy/value-objects/tag-content';
import { TagId } from '@domain/strategy/value-objects/tag-id';

describe('CreateTagUseCase', () => {
    let useCase: CreateTagUseCase;
    let mockStrategyCommandRepository: jest.Mocked<StrategyCommandRepositoryPort>;

    const strategyId = StrategyId.generate();
    const content = TagContent.create('Test');
    const position = Position.create(10, 10);

    beforeEach(() => {
        mockStrategyCommandRepository = getStrategyCommandRepositoryMocking();

        useCase = new CreateTagUseCase(mockStrategyCommandRepository);
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

            mockStrategyCommandRepository.createTag.mockResolvedValue({
                id: TagId.generate().toString(),
                position: dto.position,
                content: dto.content,
                createdAt: new Date(),
                updatedAt: new Date(),
            });

            // when
            await useCase.execute(dto);

            // then
            expect(
                mockStrategyCommandRepository.createTag
            ).toHaveBeenCalledTimes(1);
            expect(
                mockStrategyCommandRepository.createTag
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
                mockStrategyCommandRepository.createTag
            ).toHaveBeenCalledTimes(0);
        });
    });

    it('Use Case 내 도메인 호출 과정에서 예외가 발생하면, 예외가 그대로 전파되어야 한다.', async () => {
        // given
        jest.spyOn(
            mockStrategyCommandRepository,
            'createTag'
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
