import { Password } from '@domain/user/value-objects/password';
import { PasswordValidatorAdapter } from '@infrastructure/user/adapter/driving/password-validator.adapter';

describe('Password Validator Service', () => {
    let passwordValidator: PasswordValidatorAdapter;

    beforeEach(() => {
        passwordValidator = new PasswordValidatorAdapter();
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
