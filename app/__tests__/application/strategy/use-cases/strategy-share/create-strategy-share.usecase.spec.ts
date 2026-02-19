import { StrategyId } from '@domain/strategy/value-objects/strategy-id';
import { CreateStrategyShareUseCase } from '@/application/strategy/use-cases/share/create-strategy-share.usecase';
import { getStrategyCommandRepositoryMocking } from '@/__tests__/application/helpers/repository-mocking.helpers';
import { StrategyCommandRepositoryPort } from '@domain/strategy/port/repositories/strategy-command-repository.port';
import { InvalidEntityIdException } from '@domain/shared/exceptions/entity-id.exceptions';
import { UserId } from '@domain/shared/value-objects/user-id';
import { StrategySharePermission } from '@domain/strategy/enums/strategy-share-permission.enum';
import { StrategyShareId } from '@domain/strategy/value-objects/strategy-share-id';

describe('CreateStrategyShareUseCase', () => {
    let useCase: CreateStrategyShareUseCase;
    let mockStrategyCommandRepository: jest.Mocked<StrategyCommandRepositoryPort>;

    const strategyId = StrategyId.generate();
    const targetUserId = UserId.generate();
    const permission = StrategySharePermission.READ_ONLY;

    beforeEach(() => {
        mockStrategyCommandRepository = getStrategyCommandRepositoryMocking();

        useCase = new CreateStrategyShareUseCase(mockStrategyCommandRepository);
    });

    describe('성공 테스트', () => {
        it('Command를 생성하여 Repository에 전달한다.', async () => {
            // given
            const dto = {
                strategyId: strategyId.toString(),
                targetUserId: targetUserId.toString(),
                permission: permission,
            };

            mockStrategyCommandRepository.createStrategyShare.mockResolvedValue(
                {
                    id: StrategyShareId.generate().toString(),
                    sharedUserId: dto.targetUserId,
                    sharedEmail: 'test@domain.com',
                    permission: dto.permission,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                }
            );

            // when
            await useCase.execute(dto);

            // then
            expect(
                mockStrategyCommandRepository.createStrategyShare
            ).toHaveBeenCalledTimes(1);
            expect(
                mockStrategyCommandRepository.createStrategyShare
            ).toHaveBeenCalledWith(
                expect.objectContaining({
                    strategyId: strategyId,
                    targetUserId: targetUserId,
                    permission: permission,
                })
            );
        });
    });

    describe('실패 테스트', () => {
        it('DTO 파싱과정에서 실패하면 에러가 발생하여 Repository에 전달하지도 않는다.', async () => {
            // give
            const dto = {
                strategyId: 'asdf-1234',
                targetUserId: targetUserId.toString(),
                permission: permission,
            };

            // when & then
            await expect(() => useCase.execute(dto)).rejects.toThrow(
                InvalidEntityIdException
            );

            expect(
                mockStrategyCommandRepository.createStrategyShare
            ).toHaveBeenCalledTimes(0);
        });
    });

    it('Use Case 내 도메인 호출 과정에서 예외가 발생하면, 예외가 그대로 전파되어야 한다.', async () => {
        // given
        jest.spyOn(
            mockStrategyCommandRepository,
            'createStrategyShare'
        ).mockImplementation(() => {
            throw new Error();
        });

        const dto = {
            strategyId: strategyId.toString(),
            targetUserId: targetUserId.toString(),
            permission: permission,
        };

        // when & then
        await expect(() => useCase.execute(dto)).rejects.toThrow(Error);
    });
});
