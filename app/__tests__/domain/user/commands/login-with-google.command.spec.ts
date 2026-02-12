import { Email } from '@domain/shared/value-objects/email';
import { LoginWithGoogleCommand } from '@domain/user/commands/login-with-google.command';

describe('LoginWithGoogleCommand', () => {
    it('제약조건 없이 생성된다.', () => {
        // given
        const email = Email.create('test@domain.com');
        const token = 'test-1234-token';

        // when
        const command = LoginWithGoogleCommand.create(email, token);

        // then
        expect(command.email).toEqual(email);
        expect(command.token).toEqual(token);
    });
});
