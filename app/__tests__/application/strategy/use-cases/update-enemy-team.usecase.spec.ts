import { StrategyRepositoryPort } from '@domain/strategy/port/out/strategy-repository.port';
import {
    EnemyTeamNotFoundException,
    StrategyNotFoundException,
} from '@domain/strategy/exceptions/strategy.exceptions';
import { Strategy } from '@domain/strategy/entities/strategy.entity';
import { UserId } from '@domain/shared/value-objects/user-id';
import { StrategyId } from '@domain/strategy/value-objects/strategy-id';
import { PubgMap } from '@domain/strategy/enums/map.enum';
import { UpdateEnemyTeamUseCase } from '@/application/strategy/use-cases/enemy-team/update-enemy-team.usecase';
import { EnemyTeamId } from '@domain/strategy/value-objects/enemy-team-id';
import { TeamLabel } from '@domain/strategy/value-objects/team-label';
import { ZodError } from 'zod';

describe('UpdateEnemyTeamUseCase', () => {
    let useCase: UpdateEnemyTeamUseCase;
    let mockStrategyRepository: jest.Mocked<StrategyRepositoryPort>;
    let strategyFixture: Strategy;

    const ownerId = UserId.generate();

    let strategyId: StrategyId;
    let enemyTeamId: EnemyTeamId;

    const title = '전략 제목';
    const map = PubgMap.ERANGEL;

    beforeEach(() => {
        mockStrategyRepository = {
            save: jest.fn(),
            delete: jest.fn(),
            findById: jest.fn(),
            findOwnedStrategiesByUserID: jest.fn(),
            findSharedStrategiesByUserID: jest.fn(),
        } as jest.Mocked<StrategyRepositoryPort>;

        useCase = new UpdateEnemyTeamUseCase(mockStrategyRepository);

        strategyFixture = Strategy.create(ownerId, title, map);
        strategyId = strategyFixture.id;

        strategyFixture.addEnemyTeam(ownerId, TeamLabel.create('A'));
        enemyTeamId = strategyFixture.enemyTeams[0].id;
    });

    it('전략을 찾지 못하면, 에러를 던진다.', async () => {
        // given
        mockStrategyRepository.findById.mockResolvedValue(null);
        const dto = {
            actorId: ownerId.toString(),
            strategyId: strategyId.toString(),
            enemyTeamId: enemyTeamId.toString(),
            teamLabel: 'B',
            position: {
                x: 10,
                y: 200,
            },
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
            teamLabel: 'B',
            position: {
                x: 10,
                y: 200,
            },
        };

        // when & then
        await expect(() => useCase.execute(dto)).rejects.toThrow(
            EnemyTeamNotFoundException
        );
        expect(mockStrategyRepository.findById).toHaveBeenCalledTimes(1);
    });

    it('적 팀이 업데이트 된다.', async () => {
        // given
        mockStrategyRepository.findById.mockResolvedValue(strategyFixture);

        const dto = {
            actorId: ownerId.toString(),
            strategyId: strategyId.toString(),
            enemyTeamId: enemyTeamId.toString(),
            teamLabel: 'B',
            position: {
                x: 10,
                y: 200,
            },
        };

        // when
        await useCase.execute(dto);

        // then
        expect(mockStrategyRepository.findById).toHaveBeenCalledTimes(1);
        expect(mockStrategyRepository.save).toHaveBeenCalledTimes(1);

        const enemyTeam = strategyFixture.enemyTeams.find(enemyTeam =>
            enemyTeam.id.equals(enemyTeamId)
        );

        expect(enemyTeam?.teamLabel.toString()).toEqual(dto.teamLabel);
        expect(enemyTeam?.position).toEqual(dto.position);
    });

    it('적 팀 업데이트시 TeamLabel만 보낸다면, TeamLabel만 업데이트 된다.', async () => {
        // given
        mockStrategyRepository.findById.mockResolvedValue(strategyFixture);

        const dto = {
            actorId: ownerId.toString(),
            strategyId: strategyId.toString(),
            enemyTeamId: enemyTeamId.toString(),
            teamLabel: 'B',
        };

        const enemyTeam = strategyFixture.enemyTeams.find(enemyTeam =>
            enemyTeam.id.equals(enemyTeamId)
        );

        const oldPosition = enemyTeam?.position;
        const oldTeamLabel = enemyTeam?.teamLabel;

        // when
        await useCase.execute(dto);

        // then
        expect(mockStrategyRepository.findById).toHaveBeenCalledTimes(1);
        expect(mockStrategyRepository.save).toHaveBeenCalledTimes(1);

        expect(enemyTeam?.teamLabel).not.toEqual(oldTeamLabel);
        expect(enemyTeam?.teamLabel.toString()).toEqual(dto.teamLabel);
        expect(enemyTeam?.position).toEqual(oldPosition);
    });

    it('적 팀 업데이트시 Position만 보낸다면, Position만 업데이트 된다.', async () => {
        // given
        mockStrategyRepository.findById.mockResolvedValue(strategyFixture);

        const dto = {
            actorId: ownerId.toString(),
            strategyId: strategyId.toString(),
            enemyTeamId: enemyTeamId.toString(),
            position: {
                x: 10,
                y: 200,
            },
        };

        const enemyTeam = strategyFixture.enemyTeams.find(enemyTeam =>
            enemyTeam.id.equals(enemyTeamId)
        );

        const oldPosition = enemyTeam?.position;
        const oldTeamLabel = enemyTeam?.teamLabel;

        // when
        await useCase.execute(dto);

        // then
        expect(mockStrategyRepository.findById).toHaveBeenCalledTimes(1);
        expect(mockStrategyRepository.save).toHaveBeenCalledTimes(1);

        expect(enemyTeam?.position).not.toEqual(oldPosition);
        expect(enemyTeam?.position).toEqual(dto.position);
        expect(enemyTeam?.teamLabel).toEqual(oldTeamLabel);
    });

    it('적 팀 업데이트시 업데이트할 속성을 보내지 않으면, 에러를 던진다.', async () => {
        // given
        const dto = {
            actorId: ownerId.toString(),
            strategyId: strategyId.toString(),
            enemyTeamId: enemyTeamId.toString(),
        };

        // when & then
        await expect(() => useCase.execute(dto)).rejects.toThrow(ZodError);

        // then
        expect(mockStrategyRepository.findById).toHaveBeenCalledTimes(0);
        expect(mockStrategyRepository.save).toHaveBeenCalledTimes(0);
    });
});
