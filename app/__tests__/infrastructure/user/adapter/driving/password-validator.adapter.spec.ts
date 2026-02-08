import { Email } from '@domain/shared/value-objects/email';
import { Password } from '@domain/user/value-objects/password';
import { getPasswordCipherMocking } from '@/__tests__/application/helpers/service-mocking.helpers';
import { PasswordValidatorAdapter } from '@infrastructure/user/adapter/driving/password-validator.adapter';
import { PasswordCipherPort } from '@domain/user/port/out/password-cipher.port';

describe('Password Validator Service', () => {
    const email = Email.create('pubg@test.com');
    let passwordValidator: PasswordValidatorAdapter;
    let passwordCipher: jest.Mocked<PasswordCipherPort>;

    beforeEach(() => {
        passwordCipher = getPasswordCipherMocking();
        passwordCipher.decrypt.mockImplementation(
            (encryptedValue: string): string => {
                return encryptedValue.split('encrypted:')[1];
            }
        );
        passwordValidator = new PasswordValidatorAdapter(passwordCipher);
    });

    describe('EmailIncludedValidate', () => {
        it('비밀번호에 이메일이 포함되어 있지 않을 경우 성공한다.', () => {
            // given
            const password = Password.create('Qwer1234!');

            // when & then
            expect(
                passwordValidator.emailIncludedValidate(email, password)
            ).toBeTruthy();
        });

        it('비밀번호에 이메일 도메인이 포함되어 있어도 성공한다.', () => {
            // given
            const password = Password.create('Test1234!');

            // when & then
            expect(
                passwordValidator.emailIncludedValidate(email, password)
            ).toBeTruthy();
        });

        it('비밀번호에 이메일 일부가 포함되어 있을 경우 성공한다.', () => {
            // given
            const password = Password.create('Putes1234!');

            // when & then
            expect(
                passwordValidator.emailIncludedValidate(email, password)
            ).toBeTruthy();
        });

        it('비밀번호에 이메일이 포함되어 있을 경우 실패한다. (대문자)', () => {
            // given
            const password = Password.create('Pubg1234!');

            // when & then
            expect(
                passwordValidator.emailIncludedValidate(email, password)
            ).toBeFalsy();
        });
    });

    describe('CurrentPasswordMatchValidate', () => {
        it('두 비밀번호가 같지 않을 경우 실패한다.', () => {
            // given
            const oldPassword = Password.create('Pubg1234!');
            const currentPassword = Password.create('Pubg1234@');

            // when & then
            expect(
                passwordValidator.passwordMatchValidate(
                    oldPassword,
                    currentPassword
                )
            ).toBeFalsy();
        });

        it('두 비밀번호가 같을 경우 성공한다.', () => {
            // given
            const oldPassword = Password.reconstruct('encrypted:Pubg1234!');
            const currentPassword = Password.create('Pubg1234!');

            // when & then
            expect(
                passwordValidator.passwordMatchValidate(
                    oldPassword,
                    currentPassword
                )
            ).toBeTruthy();
        });
    });

    describe('PasswordDifferentValidate', () => {
        it('두 비밀번호가 같을 경우 실패한다.', () => {
            // given
            const oldPassword = Password.create('Pubg1234!');
            const currentPassword = Password.create('Pubg1234!');

            // when & then
            expect(
                passwordValidator.passwordDifferentValidate(
                    oldPassword,
                    currentPassword
                )
            ).toBeFalsy();
        });

        it('두 비밀번호가 다를 경우 성공한다.', () => {
            // given
            const oldPassword = Password.create('Pubg1234!');
            const currentPassword = Password.create('Pubg1234!@');

            // when & then
            expect(
                passwordValidator.passwordDifferentValidate(
                    oldPassword,
                    currentPassword
                )
            ).toBeTruthy();
        });
    });
});
