import { PasswordCipherAdapter } from '@infrastructure/user/adapter/password-cipher.adapter';

describe('PasswordCipherAdapter', () => {
    const PLAIN_TEXT = 'y0ngha';
    const passwordCipherAdapter = new PasswordCipherAdapter();

    describe('encrypt', () => {
        it('암호화된 문자열은 "IV:Cipher" 형식을 가져야 한다', () => {
            const encrypted = passwordCipherAdapter.encrypt(PLAIN_TEXT);

            expect(typeof encrypted).toBe('string');

            expect(encrypted).toContain(':');

            const [iv, cipher] = encrypted.split(':');
            expect(iv.length).toBe(32);
            expect(cipher.length).toBeGreaterThan(0);
        });

        it('동일한 평문을 동일한 키로 암호화해도 결과는 매번 달라야 한다 (IV 랜덤성 검증)', () => {
            const encrypted1 = passwordCipherAdapter.encrypt(PLAIN_TEXT);
            const encrypted2 = passwordCipherAdapter.encrypt(PLAIN_TEXT);

            expect(encrypted1).not.toBe(encrypted2);

            expect(passwordCipherAdapter.decrypt(encrypted1)).toBe(PLAIN_TEXT);
            expect(passwordCipherAdapter.decrypt(encrypted2)).toBe(PLAIN_TEXT);
        });
    });

    describe('decrypt', () => {
        it('암호화된 문자열을 정상적으로 복호화해야 한다', () => {
            const encrypted = passwordCipherAdapter.encrypt(PLAIN_TEXT);
            const decrypted = passwordCipherAdapter.decrypt(encrypted);

            expect(decrypted).toBe(PLAIN_TEXT);
        });

        it('형식이 잘못된 암호문(IV 없음)을 입력하면 에러를 던져야 한다', () => {
            const malformedText = 'JustRandomStringWithoutColon';

            expect(() => {
                passwordCipherAdapter.decrypt(malformedText);
            }).toThrow('Invalid encrypted text format');
        });
    });
});
