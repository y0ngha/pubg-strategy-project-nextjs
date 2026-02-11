import { LogoutCommand } from '@domain/user/commands/logout.command';

describe('LogoutCommand', () => {
    it('제약조건 없이 생성된다.', () => {
        // when
        const command = LogoutCommand.create();

        // then
        expect(command).toBeInstanceOf(LogoutCommand);
    });
});
