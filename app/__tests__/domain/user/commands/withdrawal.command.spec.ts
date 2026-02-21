import { WithdrawalCommand } from '@domain/user/commands/withdrawal.command';

describe('WithdrawalCommand', () => {
    it('제약조건 없이 생성된다.', () => {
        // when
        const command = WithdrawalCommand.create();

        // then
        expect(command).toBeInstanceOf(WithdrawalCommand);
    });
});
