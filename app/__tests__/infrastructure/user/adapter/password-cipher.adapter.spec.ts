import { PasswordCipherAdapter } from '@infrastructure/user/adapter/password-cipher.adapter';

describe('PasswordCipherAdapter (AES-256-GCM)', () => {
    const originalError = console.error;
    const PLAIN_TEXT = 'y0ngha_secure_password';
    const passwordCipherAdapter = new PasswordCipherAdapter();

    beforeAll(() => {
        console.error = () => {
            return;
        };
    });

    afterAll(() => {
        console.error = originalError;
    });

    describe('encrypt', () => {
        it('암호화된 문자열은 "IV:Cipher:AuthTag" 형식을 가져야 한다', () => {
            const encrypted = passwordCipherAdapter.encrypt(PLAIN_TEXT);

            expect(typeof encrypted).toBe('string');
            expect(encrypted.split(':').length).toBe(3);

            const [iv, cipher, authTag] = encrypted.split(':');

            expect(iv.length).toBe(24);
            expect(cipher.length).toBeGreaterThan(0);
            expect(authTag.length).toBe(32);
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

        it('형식이 잘못된 암호문(IV 또는 AuthTag 누락)을 입력하면 에러를 던져야 한다', () => {
            const malformedText1 = 'ivvalue:ciphercontent';

            const malformedText2 = 'JustRandomStringWithoutColon';

            expect(() => {
                passwordCipherAdapter.decrypt(malformedText1);
            }).toThrow('Invalid encrypted text format');

            expect(() => {
                passwordCipherAdapter.decrypt(malformedText2);
            }).toThrow('Invalid encrypted text format');
        });

        it('암호화된 데이터(Cipher)가 변조되면 복호화 실패 에러를 던져야 한다 (무결성 검증)', () => {
            const encrypted = passwordCipherAdapter.encrypt(PLAIN_TEXT);
            const parts = encrypted.split(':');

            const corruptedCipher =
                parts[1].slice(0, -1) +
                (parts[1].slice(-1) === 'a' ? 'b' : 'a');
            const corruptedText = `${parts[0]}:${corruptedCipher}:${parts[2]}`;

            expect(() => {
                passwordCipherAdapter.decrypt(corruptedText);
            }).toThrow('Decryption failed.');
        });

        it('인증 태그(AuthTag)가 변조되면 복호화 실패 에러를 던져야 한다 (인증 검증)', () => {
            const encrypted = passwordCipherAdapter.encrypt(PLAIN_TEXT);
            const parts = encrypted.split(':');

            const corruptedTag =
                parts[2].slice(0, -1) +
                (parts[2].slice(-1) === 'f' ? '0' : 'f');
            const corruptedText = `${parts[0]}:${parts[1]}:${corruptedTag}`;

            expect(() => {
                passwordCipherAdapter.decrypt(corruptedText);
            }).toThrow('Decryption failed.');
        });
    });
});
