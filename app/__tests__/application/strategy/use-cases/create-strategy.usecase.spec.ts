import { StrategyRepositoryPort } from '@domain/strategy/port/out/strategy-repository.port';
import { UserId } from '@domain/shared/value-objects/user-id';
import { CreateStrategyUseCase } from '@/application/strategy/use-cases/create-strategy.usecase';
import { PubgMap } from '@domain/strategy/enums/map.enum';
import { StrategyTitle } from '@domain/strategy/value-objects/strategy-title';
import { getStrategyRepositoryMocking } from '@/__tests__/application/helpers/repository-mocking.helpers';
import { Strategy } from '@domain/strategy/entities/strategy.entity';
import { Email } from '@domain/shared/value-objects/email';

describe('CreateStrategyUseCase', () => {
    let useCase: CreateStrategyUseCase;
    let mockStrategyRepository: jest.Mocked<StrategyRepositoryPort>;

    const ownerId = UserId.generate();
    const ownerEmail = 'test@domain.com';
    const title = StrategyTitle.create('전략 생성 테스트');
    const map = PubgMap.ERANGEL;

    beforeEach(() => {
        mockStrategyRepository = getStrategyRepositoryMocking();

        useCase = new CreateStrategyUseCase(mockStrategyRepository);
    });

    it('전략이 생성된다.', async () => {
        // given
        const dto = {
            actorId: ownerId.toString(),
            actorEmail: ownerEmail,
            title: title.toString(),
            map: map,
        };
        mockStrategyRepository.save.mockResolvedValue(
            Strategy.create(
                UserId.create(dto.actorId),
                Email.create(dto.actorEmail),
                StrategyTitle.create(dto.title),
                dto.map
            )
        );

        // when
        await useCase.execute(dto);

        // then
        expect(mockStrategyRepository.save).toHaveBeenCalledTimes(1);

        const savedStrategy = mockStrategyRepository.save.mock.calls[0][0];

        expect(savedStrategy.title.toString()).toEqual(dto.title);
        expect(savedStrategy.map).toEqual(dto.map);
        expect(savedStrategy.ownerId.toString()).toEqual(dto.actorId);
        expect(savedStrategy.ownerEmail.toString()).toEqual(dto.actorEmail);
    });

    it('예외가 발생하면, 예외가 그대로 전파되어야 한다', async () => {
        // given
        jest.spyOn(mockStrategyRepository, 'save').mockRejectedValue(
            new Error()
        );

        const dto = {
            actorId: ownerId.toString(),
            actorEmail: ownerEmail,
            title: title.toString(),
            map: map,
        };

        //when & then
        await expect(() => useCase.execute(dto)).rejects.toThrow(Error);
    });
});
