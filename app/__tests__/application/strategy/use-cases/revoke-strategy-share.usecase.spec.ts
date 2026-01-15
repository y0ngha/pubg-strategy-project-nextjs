import { StrategyRepositoryPort } from '@domain/strategy/port/out/strategy-repository.port';
import {
    StrategyNotFoundException,
    StrategyShareNotFoundException,
} from '@domain/strategy/exceptions/strategy.exceptions';
import { Strategy } from '@domain/strategy/entities/strategy.entity';
import { UserId } from '@domain/shared/value-objects/user-id';
import { StrategyId } from '@domain/strategy/value-objects/strategy-id';
import { PubgMap } from '@domain/strategy/enums/map.enum';
import { StrategyShareId } from '@domain/strategy/value-objects/strategy-share-id';
import { Email } from '@domain/shared/value-objects/email';
import { StrategySharePermission } from '@domain/strategy/enums/strategy-share-permission.enum';
import { RevokeStrategyShareUseCase } from '@/application/strategy/use-cases/share/revoke-strategy-share.usecase';
import { StrategyTitle } from '@domain/strategy/value-objects/strategy-title';

describe('RevokeStrategyShareUseCase', () => {
    let useCase: RevokeStrategyShareUseCase;
    let mockStrategyRepository: jest.Mocked<StrategyRepositoryPort>;
    let strategyFixture: Strategy;

    const ownerId = UserId.generate();
    const tagetUserId = UserId.generate();
    const tagetUserEmail = Email.create('test@domain.com');

    let strategyId: StrategyId;
    let strategyShareId: StrategyShareId;

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

        useCase = new RevokeStrategyShareUseCase(mockStrategyRepository);

        strategyFixture = Strategy.create(ownerId, title, map);
        strategyId = strategyFixture.id;

        strategyFixture.addStrategyShare(
            ownerId,
            tagetUserId,
            tagetUserEmail,
            StrategySharePermission.READ_ONLY
        );
        strategyShareId = strategyFixture.shares[0].id;
    });

    it('전략을 찾지 못하면, 에러를 던진다.', async () => {
        // given
        mockStrategyRepository.findById.mockResolvedValue(null);
        const dto = {
            actorId: ownerId.toString(),
            strategyId: strategyId.toString(),
            strategyShareId: strategyShareId.toString(),
        };

        // when & then
        await expect(() => useCase.execute(dto)).rejects.toThrow(
            StrategyNotFoundException
        );
        expect(mockStrategyRepository.findById).toHaveBeenCalledTimes(1);
    });

    it('전략 공유를 찾지 못하면, 에러를 던진다.', async () => {
        // given
        mockStrategyRepository.findById.mockResolvedValue(strategyFixture);
        const randomId = StrategyShareId.generate();

        const dto = {
            actorId: ownerId.toString(),
            strategyId: strategyId.toString(),
            strategyShareId: randomId.toString(),
        };

        // when & then
        await expect(() => useCase.execute(dto)).rejects.toThrow(
            StrategyShareNotFoundException
        );
        expect(mockStrategyRepository.findById).toHaveBeenCalledTimes(1);
    });

    it('전략 공유 권한이 회수 된다.', async () => {
        // given
        mockStrategyRepository.findById.mockResolvedValue(strategyFixture);

        const dto = {
            actorId: ownerId.toString(),
            strategyId: strategyId.toString(),
            strategyShareId: strategyShareId.toString(),
        };

        // when
        await useCase.execute(dto);

        // then
        expect(mockStrategyRepository.findById).toHaveBeenCalledTimes(1);
        expect(mockStrategyRepository.save).toHaveBeenCalledTimes(1);

        const strategyShare = strategyFixture.shares.find(strategyShare =>
            strategyShare.id.equals(strategyShareId)
        );

        expect(strategyShare?.permission).toEqual(
            StrategySharePermission.ACCESS_DENIED
        );
    });
});
