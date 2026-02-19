import { StrategyId } from '@domain/strategy/value-objects/strategy-id';
import { EnemyTeamId } from '@domain/strategy/value-objects/enemy-team-id';
import { getStrategyCommandRepositoryMocking } from '@/__tests__/application/helpers/repository-mocking.helpers';
import { StrategyCommandRepositoryPort } from '@domain/strategy/port/repositories/strategy-command-repository.port';
import { InvalidEntityIdException } from '@domain/shared/exceptions/entity-id.exceptions';
import { UpdateEnemyTeamLabelUsecase } from '@/application/strategy/use-cases/enemy-team/update-enemy-team-label.usecase';
import { TeamLabel } from '@domain/strategy/value-objects/team-label';

describe('UpdateEnemyTeamLabelUseCase', () => {
    let useCase: UpdateEnemyTeamLabelUsecase;
    let mockStrategyCommandRepository: jest.Mocked<StrategyCommandRepositoryPort>;

    const strategyId = StrategyId.generate();
    const enemyTeamId = EnemyTeamId.generate();
    const teamLabel = TeamLabel.create('A');

    beforeEach(() => {
        mockStrategyCommandRepository = getStrategyCommandRepositoryMocking();

        useCase = new UpdateEnemyTeamLabelUsecase(
            mockStrategyCommandRepository
        );
    });

    describe('성공 테스트', () => {
        it('Command를 생성하여 Repository에 전달한다.', async () => {
            // given
            const dto = {
                strategyId: strategyId.toString(),
                enemyTeamId: enemyTeamId.toString(),
                teamLabel: teamLabel.toString(),
            };

            // when
            await useCase.execute(dto);

            // then
            expect(
                mockStrategyCommandRepository.updateEnemyTeamLabel
            ).toHaveBeenCalledTimes(1);
            expect(
                mockStrategyCommandRepository.updateEnemyTeamLabel
            ).toHaveBeenCalledWith(
                expect.objectContaining({
                    strategyId: strategyId,
                    enemyTeamId: enemyTeamId,
                    teamLabel: teamLabel,
                })
            );
        });
    });

    describe('실패 테스트', () => {
        it('DTO 파싱과정에서 실패하면 에러가 발생하여 Repository에 전달하지도 않는다.', async () => {
            // give
            const dto = {
                strategyId: 'asdf-1234',
                enemyTeamId: enemyTeamId.toString(),
                teamLabel: teamLabel.toString(),
            };

            // when & then
            await expect(() => useCase.execute(dto)).rejects.toThrow(
                InvalidEntityIdException
            );

            expect(
                mockStrategyCommandRepository.updateEnemyTeamLabel
            ).toHaveBeenCalledTimes(0);
        });
    });

    it('Use Case 내 도메인 호출 과정에서 예외가 발생하면, 예외가 그대로 전파되어야 한다.', async () => {
        // given
        jest.spyOn(
            mockStrategyCommandRepository,
            'updateEnemyTeamLabel'
        ).mockImplementation(() => {
            throw new Error();
        });

        const dto = {
            strategyId: strategyId.toString(),
            enemyTeamId: enemyTeamId.toString(),
            teamLabel: teamLabel.toString(),
        };

        // when & then
        await expect(() => useCase.execute(dto)).rejects.toThrow(Error);
    });
});
