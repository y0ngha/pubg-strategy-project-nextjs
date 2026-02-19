import { StrategyId } from '@domain/strategy/value-objects/strategy-id';
import { StrategySharePermission } from '@domain/strategy/enums/strategy-share-permission.enum';
import { UserId } from '@domain/shared/value-objects/user-id';
import { CreateStrategyShareCommand } from '@domain/strategy/commands/strategy-share/create-strategy-share.command';

describe('CreateStrategyShareCommand', () => {
    it('전략 공유 생성 Command가 생성된다.', () => {
        // given
        const strategyId = StrategyId.generate();
        const targetUserId = UserId.generate();
        const permission = StrategySharePermission.READ_ONLY;

        //when
        const command = CreateStrategyShareCommand.create(
            strategyId,
            targetUserId,
            permission
        );

        // then
        expect(command).toBeInstanceOf(CreateStrategyShareCommand);
        expect(command.strategyId).toEqual(strategyId);
        expect(command.targetUserId).toEqual(targetUserId);
        expect(command.permission).toEqual(permission);
    });
});
