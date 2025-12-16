import { Email } from '@/domain/shared/value-objects/email';
import { PasswordValidatorService } from '@/domain/user/services/password-validator.service';
import { Password } from '@/domain/user/value-objects/password';

describe('Password Validator Service', () => {
    const email = Email.create('pubg@test.com');
    const passwordValidatorService = new PasswordValidatorService();

    describe('validate', () => {
        describe('실패', () => {
            it('비밀번호에 이메일이 포함되어 있을 경우 실패한다. (대문자)', () => {
                const password = Password.create('Pubg1234!');

                expect(
                    passwordValidatorService.validate(email, password)
                ).toBeFalsy();
            });
        });

        describe('성공', () => {
            it('비밀번호에 이메일이 포함되어 있지 않을 경우 성공한다.', () => {
                const password = Password.create('Qwer1234!');

                expect(
                    passwordValidatorService.validate(email, password)
                ).toBeTruthy();
            });

            it('비밀번호에 이메일 도메인이 포함되어 있어도 성공한다.', () => {
                const password = Password.create('Test1234!');

                expect(
                    passwordValidatorService.validate(email, password)
                ).toBeTruthy();
            });

            it('비밀번호에 이메일 일부가 포함되어 있을 경우 성공한다.', () => {
                const password = Password.create('Putes1234!');

                expect(
                    passwordValidatorService.validate(email, password)
                ).toBeTruthy();
            });
        });
    });
});
