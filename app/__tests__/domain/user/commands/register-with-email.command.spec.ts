import { Password } from '@domain/user/value-objects/password';
import { Email } from '@domain/shared/value-objects/email';
import { RegisterWithEmailCommand } from '@domain/user/commands/register-with-email.command';

describe('RegisterWithEmailCommand', () => {
    it('제약조건 없이 생성된다.', () => {
        // given
        const email = Email.create('test@domain.com');
        const password = Password.create('Asdf1234@');

        // when
        const command = RegisterWithEmailCommand.create(email, password);

        // then
        expect(command.email).toEqual(email);
        expect(command.password).toEqual(password);
    });
});
