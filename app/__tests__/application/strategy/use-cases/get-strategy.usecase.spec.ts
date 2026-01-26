import { StrategyRepositoryPort } from '@domain/strategy/port/out/strategy-repository.port';
import {
    DeletedStrategyException,
    StrategyAccessDeniedException,
    StrategyNotFoundException,
} from '@domain/strategy/exceptions/strategy.exceptions';
import { Strategy } from '@domain/strategy/entities/strategy.entity';
import { UserId } from '@domain/shared/value-objects/user-id';
import { StrategyId } from '@domain/strategy/value-objects/strategy-id';
import { PubgMap } from '@domain/strategy/enums/map.enum';
import { StrategySharePermission } from '@domain/strategy/enums/strategy-share-permission.enum';
import { StrategyTitle } from '@domain/strategy/value-objects/strategy-title';
import { GetStrategyUseCase } from '@/application/strategy/use-cases/get-strategy.usecase';
import { StrategyMapper } from '@/application/strategy/mappers/strategy.mapper';
import { Email } from '@domain/shared/value-objects/email';
import { getStrategyRepositoryMocking } from '@/__tests__/application/helpers/repository-mocking.helpers';

describe('GetStrategyUseCase', () => {
    let useCase: GetStrategyUseCase;
    let mockStrategyRepository: jest.Mocked<StrategyRepositoryPort>;
    const strategyMapper = new StrategyMapper();
    let strategyFixture: Strategy;

    const ownerId = UserId.generate();
    const editorId = UserId.generate();
    const viewerId = UserId.generate();
    const strangerId = UserId.generate();

    const ownerEmail = Email.create('test@domain.com');
    const editorEmail = Email.create('editor@test.com');
    const viewerEmail = Email.create('viewer@test.com');

    let strategyId: StrategyId;

    const title = StrategyTitle.create('전략 제목');
    const map = PubgMap.ERANGEL;

    beforeEach(() => {
        mockStrategyRepository = getStrategyRepositoryMocking();

        useCase = new GetStrategyUseCase(
            mockStrategyRepository,
            strategyMapper
        );

        strategyFixture = Strategy.create(ownerId, ownerEmail, title, map);
        strategyId = strategyFixture.id;

        strategyFixture.addStrategyShare(
            ownerId,
            editorId,
            editorEmail,
            StrategySharePermission.EDITABLE
        );

        strategyFixture.addStrategyShare(
            ownerId,
            viewerId,
            viewerEmail,
            StrategySharePermission.READ_ONLY
        );
    });

    it('전략을 찾지 못하면, 에러를 던진다.', async () => {
        // given
        mockStrategyRepository.findById.mockResolvedValue(null);
        const dto = {
            actorId: ownerId.toString(),
            strategyId: strategyId.toString(),
        };

        // when & then
        await expect(() => useCase.execute(dto)).rejects.toThrow(
            StrategyNotFoundException
        );
        expect(mockStrategyRepository.findById).toHaveBeenCalledTimes(1);
    });

    it('접근이 불가능한 전략이면(공유 받은 것도 아니고, 본인것도 아니면), 에러를 던진다.', async () => {
        // given
        mockStrategyRepository.findById.mockResolvedValue(strategyFixture);

        const dto = {
            actorId: strangerId.toString(),
            strategyId: strategyId.toString(),
        };

        // when & then
        await expect(() => useCase.execute(dto)).rejects.toThrow(
            StrategyAccessDeniedException
        );
        expect(mockStrategyRepository.findById).toHaveBeenCalledTimes(1);
    });

    it('전략이 조회된다.', async () => {
        // given
        mockStrategyRepository.findById.mockResolvedValue(strategyFixture);

        const dto = {
            actorId: ownerId.toString(),
            strategyId: strategyId.toString(),
        };

        // when
        const strategy = await useCase.execute(dto);

        // then
        expect(strategy.id).toEqual(strategyId.toString());
    });

    it('Use Case 내 도메인 호출 과정에서 예외가 발생하면, 예외가 그대로 전파되어야 한다.', async () => {
        // given
        jest.spyOn(strategyFixture, 'isAccessibleByUserId').mockImplementation(
            () => {
                throw new DeletedStrategyException();
            }
        );

        mockStrategyRepository.findById.mockResolvedValue(strategyFixture);

        const dto = {
            actorId: ownerId.toString(),
            strategyId: strategyId.toString(),
        };

        //when & then
        await expect(() => useCase.execute(dto)).rejects.toThrow(
            DeletedStrategyException
        );
    });
});
