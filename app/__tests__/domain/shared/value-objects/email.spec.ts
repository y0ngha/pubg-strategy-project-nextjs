import { Email } from '@domain/shared/value-objects/email';

describe('Email', () => {
    describe('create', () => {
        it('유효한 이메일로 Email을 생성한다', () => {
            // When
            const email = Email.create('test@example.com');

            // Then
            expect(email).toBeInstanceOf(Email);
            expect(email.toString()).toBe('test@example.com');
        });

        it('이메일을 소문자로 변환한다', () => {
            // When
            const email = Email.create('Test@Example.COM');

            // Then
            expect(email.toString()).toBe('test@example.com');
        });

        it('앞뒤 공백을 제거한다', () => {
            // When
            const email = Email.create('  test@example.com  ');

            // Then
            expect(email.toString()).toBe('test@example.com');
        });

        it('빈 문자열은 에러를 던진다', () => {
            // When & Then
            expect(() => Email.create('')).toThrow(
                '이메일은 비어있을 수 없습니다.'
            );
        });

        it('공백만 있는 문자열은 에러를 던진다', () => {
            // When & Then
            expect(() => Email.create('   ')).toThrow(
                '이메일은 비어있을 수 없습니다.'
            );
        });

        it('@ 가 없으면 에러를 던진다', () => {
            // When & Then
            expect(() => Email.create('testexample.com')).toThrow(
                '이메일에는 "@"가 필수로 포함되어야 합니다.'
            );
        });

        it('. 이 없으면 에러를 던진다', () => {
            // When & Then
            expect(() => Email.create('test@examplecom')).toThrow(
                '이메일에는 "."이 필수로 포함되어야 합니다.'
            );
        });

        it('@ 앞부분이 없으면 에러를 던진다', () => {
            // When & Then
            expect(() => Email.create('@example.com')).toThrow(
                '유효하지 않은 이메일 형식입니다.'
            );
        });

        it('@ 뒷부분이 없으면 에러를 던진다', () => {
            // When & Then
            expect(() => Email.create('test@')).toThrow(
                '유효하지 않은 이메일 형식입니다.'
            );
        });

        it('도메인에 . 이 없으면 에러를 던진다', () => {
            // When & Then
            expect(() => Email.create('test@example')).toThrow(
                '이메일에는 "."이 필수로 포함되어야 합니다.'
            );
        });

        it('공백이 포함되면 에러를 던진다', () => {
            // When & Then
            expect(() => Email.create('test @example.com')).toThrow(
                '유효하지 않은 이메일 형식입니다.'
            );
            expect(() => Email.create('test@ example.com')).toThrow(
                '유효하지 않은 이메일 형식입니다.'
            );
        });

        it('특수 문자가 포함된 유효한 이메일을 생성한다', () => {
            // When
            const email = Email.create('test.name+tag@example.co.kr');

            // Then
            expect(email.toString()).toBe('test.name+tag@example.co.kr');
        });
    });

    describe('equals', () => {
        it('같은 값을 가진 Email은 동등하다', () => {
            // Given
            const email1 = Email.create('test@example.com');
            const email2 = Email.create('test@example.com');

            // When & Then
            expect(email1.equals(email2)).toBe(true);
        });

        it('대소문자가 다르지만 동등하다', () => {
            // Given
            const email1 = Email.create('Test@Example.com');
            const email2 = Email.create('test@example.com');

            // When & Then
            expect(email1.equals(email2)).toBe(true);
        });

        it('다른 값을 가진 Email은 동등하지 않다', () => {
            // Given
            const email1 = Email.create('test1@example.com');
            const email2 = Email.create('test2@example.com');

            // When & Then
            expect(email1.equals(email2)).toBe(false);
        });

        it('Email이 아닌 객체는 동등하지 않다', () => {
            // Given
            const email = Email.create('test@example.com');
            const notEmail = { value: 'test@example.com' } as never;

            // When & Then
            expect(email.equals(notEmail)).toBe(false);
        });
    });

    describe('toString', () => {
        it('원시 값을 반환한다', () => {
            // Given
            const email = Email.create('test@example.com');

            // When
            const result = email.toString();

            // Then
            expect(result).toBe('test@example.com');
        });
    });

    describe('toJSON', () => {
        it('JSON 직렬화 시 원시 값을 반환한다', () => {
            // Given
            const email = Email.create('test@example.com');

            // When
            const result = JSON.stringify({ email });

            // Then
            expect(result).toBe('{"email":"test@example.com"}');
        });
    });
});
