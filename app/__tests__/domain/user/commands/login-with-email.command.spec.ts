import { Password } from '@domain/user/value-objects/password';
import { Email } from '@domain/shared/value-objects/email';
import { LoginWithEmailCommand } from '@domain/user/commands/login-with-email.command';
import { PasswordCipherPort } from '@domain/user/port/out/password-cipher.port';
import { getPasswordCipherMocking } from '@/__tests__/application/helpers/service-mocking.helpers';

describe('LoginWithEmailCommand', () => {
    let passwordCipher: jest.Mocked<PasswordCipherPort>;

    beforeEach(() => {
        passwordCipher = getPasswordCipherMocking();

        passwordCipher.encrypt.mockImplementation((value: string) => {
            return `encrypted:${value}`;
        });
    });

    it('제약조건 없이 생성된다.', () => {
        // given
        const email = Email.create('test@domain.com');
        const password = Password.create('Asdf1234@');

        // when
        const command = LoginWithEmailCommand.create(
            email,
            password,
            passwordCipher
        );

        // then
        expect(command.email).toEqual(email);
        expect(command.password.toString()).toEqual(
            `encrypted:${password.toString()}`
        );
    });
});
