import { StrategyId } from '@domain/strategy/value-objects/strategy-id';
import { TagId } from '@domain/strategy/value-objects/tag-id';
import { getStrategyCommandRepositoryMocking } from '@/__tests__/application/helpers/repository-mocking.helpers';
import { StrategyCommandRepositoryPort } from '@domain/strategy/port/repositories/strategy-command-repository.port';
import { InvalidEntityIdException } from '@domain/shared/exceptions/entity-id.exceptions';
import { UpdateTagContentUseCase } from '@/application/strategy/use-cases/tag/update-tag-content.usecase';
import { TagContent } from '@domain/strategy/value-objects/tag-content';

describe('UpdateTagContentUseCase', () => {
    let useCase: UpdateTagContentUseCase;
    let mockStrategyCommandRepository: jest.Mocked<StrategyCommandRepositoryPort>;

    const strategyId = StrategyId.generate();
    const tagId = TagId.generate();
    const content = TagContent.create('Test');

    beforeEach(() => {
        mockStrategyCommandRepository = getStrategyCommandRepositoryMocking();

        useCase = new UpdateTagContentUseCase(mockStrategyCommandRepository);
    });

    describe('성공 테스트', () => {
        it('Command를 생성하여 Repository에 전달한다.', async () => {
            // given
            const dto = {
                strategyId: strategyId.toString(),
                tagId: tagId.toString(),
                content: content.toString(),
            };

            // when
            await useCase.execute(dto);

            // then
            expect(
                mockStrategyCommandRepository.updateTagContent
            ).toHaveBeenCalledTimes(1);
            expect(
                mockStrategyCommandRepository.updateTagContent
            ).toHaveBeenCalledWith(
                expect.objectContaining({
                    strategyId: strategyId,
                    tagId: tagId,
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
                tagId: tagId.toString(),
                content: content.toString(),
            };

            // when & then
            await expect(() => useCase.execute(dto)).rejects.toThrow(
                InvalidEntityIdException
            );

            expect(
                mockStrategyCommandRepository.updateTagContent
            ).toHaveBeenCalledTimes(0);
        });
    });

    it('Use Case 내 도메인 호출 과정에서 예외가 발생하면, 예외가 그대로 전파되어야 한다.', async () => {
        // given
        jest.spyOn(
            mockStrategyCommandRepository,
            'updateTagContent'
        ).mockImplementation(() => {
            throw new Error();
        });

        const dto = {
            strategyId: strategyId.toString(),
            tagId: tagId.toString(),
            content: content.toString(),
        };

        // when & then
        await expect(() => useCase.execute(dto)).rejects.toThrow(Error);
    });
});
