import { StrategyRepositoryPort } from '@domain/strategy/port/out/strategy-repository.port';
import { StrategyNotFoundException } from '@domain/strategy/exceptions/strategy.exceptions';
import { Strategy } from '@domain/strategy/entities/strategy.entity';
import { UserId } from '@domain/shared/value-objects/user-id';
import { StrategyId } from '@domain/strategy/value-objects/strategy-id';
import { PubgMap } from '@domain/strategy/enums/map.enum';
import { CreateStrategyShareUseCase } from '@/application/strategy/use-cases/share/create-strategy-share.usecase';
import { UserRepositoryPort } from '@domain/user/port/out/user-repository.port';
import { StrategySharePermission } from '@domain/strategy/enums/strategy-share-permission.enum';
import { UserNotFoundException } from '@domain/user/exceptions/user.exceptions';
import { User } from '@domain/user/entities/user.entity';
import { Password } from '@domain/user/value-objects/password';
import { Email } from '@domain/shared/value-objects/email';
import { StrategyTitle } from '@domain/strategy/value-objects/strategy-title';

describe('CreateStrategyShareUseCase', () => {
    let useCase: CreateStrategyShareUseCase;
    let mockStrategyRepository: jest.Mocked<StrategyRepositoryPort>;
    let mockUserRepository: jest.Mocked<UserRepositoryPort>;

    let strategyFixture: Strategy;
    let userFixture: User;

    const ownerId = UserId.generate();

    let strategyId: StrategyId;
    let targetUserId: UserId;

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

        mockUserRepository = {
            save: jest.fn(),
            findByUserId: jest.fn(),
            delete: jest.fn(),
            existsByEmail: jest.fn(),
        } as jest.Mocked<UserRepositoryPort>;

        useCase = new CreateStrategyShareUseCase(
            mockStrategyRepository,
            mockUserRepository
        );

        strategyFixture = Strategy.create(ownerId, title, map);
        strategyId = strategyFixture.id;

        userFixture = User.createWithEmail(
            Email.create('test@domain.com'),
            Password.create('Abcd1234@')
        );
        targetUserId = userFixture.id;
    });

    it('전략을 찾지 못하면, 에러를 던진다.', async () => {
        // given
        mockStrategyRepository.findById.mockResolvedValue(null);

        const dto = {
            actorId: ownerId.toString(),
            strategyId: strategyId.toString(),
            targetUserId: targetUserId.toString(),
            permission: StrategySharePermission.READ_ONLY,
        };

        // when & then
        await expect(() => useCase.execute(dto)).rejects.toThrow(
            StrategyNotFoundException
        );
        expect(mockStrategyRepository.findById).toHaveBeenCalledTimes(1);
        expect(mockUserRepository.findByUserId).toHaveBeenCalledTimes(0);
    });

    it('유저를 찾지 못하면, 에러를 던진다.', async () => {
        // given
        mockStrategyRepository.findById.mockResolvedValue(strategyFixture);
        mockUserRepository.findByUserId.mockResolvedValue(null);

        const randomId = UserId.generate();

        const dto = {
            actorId: ownerId.toString(),
            strategyId: strategyId.toString(),
            targetUserId: randomId.toString(),
            permission: StrategySharePermission.READ_ONLY,
        };

        // when & then
        await expect(() => useCase.execute(dto)).rejects.toThrow(
            UserNotFoundException
        );
        expect(mockStrategyRepository.findById).toHaveBeenCalledTimes(1);
        expect(mockUserRepository.findByUserId).toHaveBeenCalledTimes(1);
    });

    it('전략 공유가 추가된다.', async () => {
        // given
        mockStrategyRepository.findById.mockResolvedValue(strategyFixture);
        mockUserRepository.findByUserId.mockResolvedValue(userFixture);

        const dto = {
            actorId: ownerId.toString(),
            strategyId: strategyId.toString(),
            targetUserId: targetUserId.toString(),
            permission: StrategySharePermission.READ_ONLY,
        };

        // when
        await useCase.execute(dto);

        // then
        expect(mockStrategyRepository.findById).toHaveBeenCalledTimes(1);
        expect(mockStrategyRepository.save).toHaveBeenCalledTimes(1);

        const strategyShare = strategyFixture.shares.find(
            strategyShare =>
                strategyShare?.sharedUserId.toString() === dto.targetUserId
        );

        expect(strategyFixture.shares).toHaveLength(1);
        expect(strategyShare?.sharedUserId.toString()).toEqual(
            dto.targetUserId
        );
    });
});
