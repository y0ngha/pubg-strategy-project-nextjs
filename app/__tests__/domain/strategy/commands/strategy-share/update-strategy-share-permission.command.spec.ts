import { StrategyId } from '@domain/strategy/value-objects/strategy-id';
import { StrategySharePermission } from '@domain/strategy/enums/strategy-share-permission.enum';
import { StrategyShareId } from '@domain/strategy/value-objects/strategy-share-id';
import { UpdateStrategySharePermissionCommand } from '@domain/strategy/commands/strategy-share/update-strategy-share-permission.command';

describe('UpdateStrategySharePermissionCommand', () => {
    it('전략 공유 권한 수정 Command가 생성된다.', () => {
        // given
        const strategyId = StrategyId.generate();
        const strategyShareId = StrategyShareId.generate();
        const permission = StrategySharePermission.READ_ONLY;

        //when
        const command = UpdateStrategySharePermissionCommand.create(
            strategyId,
            strategyShareId,
            permission
        );

        // then
        expect(command).toBeInstanceOf(UpdateStrategySharePermissionCommand);
        expect(command.strategyId).toEqual(strategyId);
        expect(command.strategyShareId).toEqual(strategyShareId);
        expect(command.permission).toEqual(permission);
    });
});
