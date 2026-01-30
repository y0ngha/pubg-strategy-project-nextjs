import { StrategyRepositoryPort } from '@domain/strategy/port/out/strategy-repository.port';
import {
    EnemyTeamNotFoundException,
    StrategyEditPermissionDeniedException,
    StrategyNotFoundException,
} from '@domain/strategy/exceptions/strategy.exceptions';
import { Strategy } from '@domain/strategy/entities/strategy.entity';
import { UserId } from '@domain/shared/value-objects/user-id';
import { StrategyId } from '@domain/strategy/value-objects/strategy-id';
import { PubgMap } from '@domain/strategy/enums/map.enum';
import { DeleteEnemyTeamUseCase } from '@/application/strategy/use-cases/enemy-team/delete-enemy-team.usecase';
import { EnemyTeamId } from '@domain/strategy/value-objects/enemy-team-id';
import { TeamLabel } from '@domain/strategy/value-objects/team-label';
import { StrategyTitle } from '@domain/strategy/value-objects/strategy-title';
import { getStrategyRepositoryMocking } from '@/__tests__/application/helpers/repository-mocking.helpers';
import { Email } from '@domain/shared/value-objects/email';
import { Position } from '@domain/strategy/value-objects/position';

describe('DeleteEnemyTeamUseCase', () => {
    let useCase: DeleteEnemyTeamUseCase;
    let mockStrategyRepository: jest.Mocked<StrategyRepositoryPort>;
    let strategyFixture: Strategy;

    const ownerId = UserId.generate();
    const ownerEmail = Email.create('test@domain.com');

    let strategyId: StrategyId;
    let enemyTeamId: EnemyTeamId;

    const title = StrategyTitle.create('전략 제목');
    const map = PubgMap.ERANGEL;

    beforeEach(() => {
        mockStrategyRepository = getStrategyRepositoryMocking();

        useCase = new DeleteEnemyTeamUseCase(mockStrategyRepository);

        strategyFixture = Strategy.create(ownerId, ownerEmail, title, map);
        strategyId = strategyFixture.id;

        strategyFixture.addEnemyTeam(
            ownerId,
            TeamLabel.create('A'),
            Position.create(1, 1)
        );
        enemyTeamId = strategyFixture.enemyTeams[0].id;
    });

    it('전략을 찾지 못하면, 에러를 던진다.', async () => {
        // given
        mockStrategyRepository.findById.mockResolvedValue(null);
        const dto = {
            actorId: ownerId.toString(),
            strategyId: strategyId.toString(),
            enemyTeamId: enemyTeamId.toString(),
        };

        // when & then
        await expect(() => useCase.execute(dto)).rejects.toThrow(
            StrategyNotFoundException
        );
        expect(mockStrategyRepository.findById).toHaveBeenCalledTimes(1);
    });

    it('적 팀을 찾지 못하면, 에러를 던진다.', async () => {
        // given
        mockStrategyRepository.findById.mockResolvedValue(strategyFixture);
        const randomId = EnemyTeamId.generate();

        const dto = {
            actorId: ownerId.toString(),
            strategyId: strategyId.toString(),
            enemyTeamId: randomId.toString(),
        };

        // when & then
        await expect(() => useCase.execute(dto)).rejects.toThrow(
            EnemyTeamNotFoundException
        );
        expect(mockStrategyRepository.findById).toHaveBeenCalledTimes(1);
    });

    it('적 팀이 삭제된다.', async () => {
        // given
        mockStrategyRepository.findById.mockResolvedValue(strategyFixture);

        const dto = {
            actorId: ownerId.toString(),
            strategyId: strategyId.toString(),
            enemyTeamId: enemyTeamId.toString(),
        };

        // when
        await useCase.execute(dto);

        // then
        expect(mockStrategyRepository.findById).toHaveBeenCalledTimes(1);
        expect(mockStrategyRepository.save).toHaveBeenCalledTimes(1);

        const enemyTeam = strategyFixture.enemyTeams.find(enemyTeam =>
            enemyTeam.id.equals(enemyTeamId)
        );

        expect(enemyTeam).toBeUndefined();
    });

    it('Use Case 내 도메인 호출 과정에서 예외가 발생하면, 예외가 그대로 전파되어야 한다.', async () => {
        // Given
        jest.spyOn(strategyFixture, 'removeEnemyTeam').mockImplementation(
            () => {
                throw new StrategyEditPermissionDeniedException();
            }
        );

        mockStrategyRepository.findById.mockResolvedValue(strategyFixture);

        const dto = {
            actorId: ownerId.toString(),
            strategyId: strategyId.toString(),
            enemyTeamId: enemyTeamId.toString(),
        };

        // When & Then
        await expect(useCase.execute(dto)).rejects.toThrow(
            StrategyEditPermissionDeniedException
        );
    });
});
