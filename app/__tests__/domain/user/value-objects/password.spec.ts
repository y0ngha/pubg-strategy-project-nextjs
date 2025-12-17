import { Password } from '@/domain/user/value-objects/password';

describe('Password', () => {
    const validPassword = 'Test1234!';

    describe('create', () => {
        it('유효한 비밀번호로 Password를 생성한다', () => {
            // When
            const password = Password.create(validPassword);

            // Then
            expect(password).toBeInstanceOf(Password);
            expect(password.toString()).toBe(validPassword);
        });

        it('빈 문자열은 에러를 던진다', () => {
            // When & Then
            expect(() => Password.create('')).toThrow(
                '비밀번호는 빈 값일 수 없습니다.'
            );
        });

        it('공백만 있는 문자열은 에러를 던진다', () => {
            // When & Then
            expect(() => Password.create('   ')).toThrow(
                '비밀번호는 빈 값일 수 없습니다.'
            );
        });

        it('8자 미만은 에러를 던진다', () => {
            // When & Then
            expect(() => Password.create('Test1!')).toThrow(
                '비밀번호는 최소 8자리 이상으로 구성되어야 합니다.'
            );
        });

        it('대문자가 없으면 에러를 던진다', () => {
            // When & Then
            expect(() => Password.create('test1234!')).toThrow(
                '비밀번호에는 최소 1글자 이상 대문자 영문이 포함되어야 합니다.'
            );
        });

        it('소문자가 없으면 에러를 던진다', () => {
            // When & Then
            expect(() => Password.create('TEST1234!')).toThrow(
                '비밀번호에는 최소 1글자 이상 소문자 영문이 포함되어야 합니다.'
            );
        });

        it('숫자가 없으면 에러를 던진다', () => {
            // When & Then
            expect(() => Password.create('TestTest!')).toThrow(
                '비밀번호에는 최소 1글자 이상 숫자가 포함되어야 합니다.'
            );
        });

        it('특수문자가 없으면 에러를 던진다', () => {
            // When & Then
            expect(() => Password.create('Test1234')).toThrow(
                '비밀번호에는 최소 1글자 이상 특수문자가 포함되어야 합니다.'
            );
        });

        it('모든 조건을 만족하는 비밀번호를 생성한다', () => {
            // When
            const password = Password.create(validPassword);

            // Then
            expect(password.toString()).toBe(validPassword);
        });
    });

    describe('reconstruct', () => {
        it('해시된 비밀번호를 검증 없이 생성한다', () => {
            // Given
            const hashedPassword = '$2b$10$abcdefghijklmnopqrstuvwxyz';

            // When
            const password = Password.reconstruct(hashedPassword);

            // Then
            expect(password.toString()).toBe(hashedPassword);
        });

        it('검증 규칙을 적용하지 않는다', () => {
            // Given (정책 위반 문자열)
            const hashedPassword = 'short';

            // When & Then (에러 발생 안함)
            expect(() => Password.reconstruct(hashedPassword)).not.toThrow();
        });
    });

    describe('equals', () => {
        it('같은 값을 가진 Password는 동등하다', () => {
            // Given
            const password1 = Password.create(validPassword);
            const password2 = Password.create(validPassword);

            // When & Then
            expect(password1.equals(password2)).toBe(true);
        });

        it('다른 값을 가진 Password는 동등하지 않다', () => {
            // Given
            const password1 = Password.create('Test1234!');
            const password2 = Password.create('Test5678!');

            // When & Then
            expect(password1.equals(password2)).toBe(false);
        });

        it('Password가 아닌 객체는 동등하지 않다', () => {
            // Given
            const password = Password.create(validPassword);
            const notPassword = { value: validPassword } as never;

            // When & Then
            expect(password.equals(notPassword)).toBe(false);
        });
    });

    describe('contains', () => {
        it('특정 문자열이 포함되어 있는지 확인한다', () => {
            // Given
            const password = Password.create('Test1234!');

            // When & Then
            expect(password.contains('test')).toBe(true);
            expect(password.contains('Test')).toBe(true);
            expect(password.contains('1234')).toBe(true);
        });

        it('대소문자를 구분하지 않는다', () => {
            // Given
            const password = Password.create('Test1234!');

            // When & Then
            expect(password.contains('TEST')).toBe(true);
            expect(password.contains('test')).toBe(true);
        });

        it('포함되지 않은 문자열은 false를 반환한다', () => {
            // Given
            const password = Password.create('Test1234!');

            // When & Then
            expect(password.contains('xyz')).toBe(false);
        });
    });

    describe('toString', () => {
        it('원시 값을 반환한다', () => {
            // Given
            const password = Password.create(validPassword);

            // When
            const result = password.toString();

            // Then
            expect(result).toBe(validPassword);
        });
    });

    describe('toJSON', () => {
        it('JSON 직렬화 시 비밀번호를 보호한다', () => {
            // Given
            const password = Password.create(validPassword);

            // When
            const result = JSON.stringify({ password });

            // Then
            expect(result).toBe(`{"password":"[PROTECTED]"}`);
        });
    });
});
