import { Email } from '@domain/shared/value-objects/email';
import { RegisterWithGoogleCommand } from '@domain/user/commands/register-with-google.command';

describe('RegisterWithGoogleCommand', () => {
    it('제약조건 없이 생성된다.', () => {
        // given
        const email = Email.create('test@domain.com');
        const token = 'test-1234-token';

        // when
        const command = RegisterWithGoogleCommand.create(email, token);

        // then
        expect(command.email).toEqual(email);
        expect(command.token).toEqual(token);
    });
});
