// __tests__/domain/user/entities/user.entity.spec.ts

import { Email } from '@/domain/shared/value-objects/email';
import { UserId } from '@/domain/shared/value-objects/user-id';
import { User } from '@/domain/user/entities/user.entity';
import { AuthProvider } from '@/domain/user/enums/AuthProvider.enum';
import { Password } from '@/domain/user/value-objects/password';

describe('User Entity', () => {
    const validEmail = Email.create('test@example.com');
    const validPassword = Password.create('Test1234!');

    describe('createWithEmail', () => {
        it('이메일과 비밀번호로 사용자를 생성한다', () => {
            // When
            const user = User.createWithEmail(validEmail, validPassword);

            // Then
            expect(user).toBeInstanceOf(User);
            expect(user.email).toBe(validEmail);
            expect(user.password).toBe(validPassword);
            expect(user.authProvider).toBe(AuthProvider.EMAIL);
            expect(user.isSSOUser()).toBe(false);
            expect(user.id).toBe(null);
            expect(user.createdAt).toBeInstanceOf(Date);
            expect(user.updatedAt).toBeInstanceOf(Date);
        });

        it('생성 시 createdAt과 updatedAt이 같다', () => {
            // When
            const user = User.createWithEmail(validEmail, validPassword);

            // Then
            expect(user.createdAt.getTime()).toBe(user.updatedAt.getTime());
        });
    });

    describe('createWithSSO', () => {
        it('SSO 사용자를 생성한다 (비밀번호 없음)', () => {
            // When
            const user = User.createWithSSO(validEmail);

            // Then
            expect(user).toBeInstanceOf(User);
            expect(user.email).toBe(validEmail);
            expect(user.password).toBeNull();
            expect(user.authProvider).toBe(AuthProvider.GOOGLE);
            expect(user.isSSOUser()).toBe(true);
            expect(user.id).toBe(null);
            expect(user.createdAt).toBeInstanceOf(Date);
            expect(user.updatedAt).toBeInstanceOf(Date);
        });
    });

    describe('reconstruct', () => {
        it('기존 사용자 데이터를 재구성한다', () => {
            // Given
            const id = UserId.create('550e8400-e29b-41d4-a716-446655440000');
            const createdAt = new Date('2024-01-01');
            const updatedAt = new Date('2024-01-02');

            // When
            const user = User.reconstruct(
                id,
                validEmail,
                validPassword,
                AuthProvider.EMAIL,
                createdAt,
                updatedAt
            );

            // Then
            expect(user.id).toBe(id);
            expect(user.email).toBe(validEmail);
            expect(user.password).toBe(validPassword);
            expect(user.authProvider).toBe(AuthProvider.EMAIL);
            expect(user.createdAt).toBe(createdAt);
            expect(user.updatedAt).toBe(updatedAt);
        });

        it('비밀번호가 없는 사용자를 재구성한다', () => {
            // Given
            const id = UserId.create('550e8400-e29b-41d4-a716-446655440000');
            const createdAt = new Date('2024-01-01');
            const updatedAt = new Date('2024-01-02');

            // When
            const user = User.reconstruct(
                id,
                validEmail,
                null,
                AuthProvider.GOOGLE,
                createdAt,
                updatedAt
            );

            // Then
            expect(user.id).toBe(id);
            expect(user.email).toBe(validEmail);
            expect(user.password).toBe(null);
            expect(user.authProvider).toBe(AuthProvider.GOOGLE);
            expect(user.createdAt).toBe(createdAt);
            expect(user.updatedAt).toBe(updatedAt);
            expect(user.isSSOUser()).toBe(true);
        });
    });

    describe('changePassword', () => {
        it('비밀번호를 변경한다', () => {
            // Given
            const user = User.createWithEmail(validEmail, validPassword);
            const newPassword = Password.create('NewPass1234!');
            const oldUpdatedAt = user.updatedAt;

            // 시간 차이를 두기 위해 약간 대기
            jest.useFakeTimers();
            jest.advanceTimersByTime(1000);

            // When
            user.changePassword(validPassword, newPassword);

            // Then
            expect(user.password).toBe(newPassword);
            expect(user.updatedAt.getTime()).toBeGreaterThan(
                oldUpdatedAt.getTime()
            );

            jest.useRealTimers();
        });

        it('현재 비밀번호가 없는 User 객체면(SSO 유저) 별도의 검증 없이 성공한다.', () => {
            // Given
            const user = User.createWithSSO(validEmail);
            const newPassword = Password.create('NewPass1234!');
            const oldUpdatedAt = user.updatedAt;

            // 시간 차이를 두기 위해 약간 대기
            jest.useFakeTimers();
            jest.advanceTimersByTime(1000);

            // When
            user.changePassword(null, newPassword);

            // Then
            expect(user.password).toBe(newPassword);
            expect(user.updatedAt.getTime()).toBeGreaterThan(
                oldUpdatedAt.getTime()
            );

            jest.useRealTimers();
        });

        it('현재 비밀번호가 일치하지 않으면 에러를 던진다', () => {
            // Given
            const user = User.createWithEmail(validEmail, validPassword);
            const wrongPassword = Password.create('Wrong1234!');
            const newPassword = Password.create('NewPass1234!');

            // When & Then
            expect(() =>
                user.changePassword(wrongPassword, newPassword)
            ).toThrow('비밀번호가 일치하지 않습니다.');
        });

        it('새 비밀번호가 현재 비밀번호와 같으면 에러를 던진다', () => {
            // Given
            const user = User.createWithEmail(validEmail, validPassword);

            // When & Then
            expect(() =>
                user.changePassword(validPassword, validPassword)
            ).toThrow('기존 비밀번호와 새로운 비밀번호는 일치할 수 없습니다.');
        });
    });

    describe('isSSOUser', () => {
        it('SSO 사용자면 true를 반환한다', () => {
            // Given
            const user = User.createWithSSO(validEmail);

            // When & Then
            expect(user.isSSOUser()).toBe(true);
        });

        it('일반 사용자면 false를 반환한다', () => {
            // Given
            const user = User.createWithEmail(validEmail, validPassword);

            // When & Then
            expect(user.isSSOUser()).toBe(false);
        });
    });

    describe('equals', () => {
        it('같은 ID를 가진 사용자는 동등하다', () => {
            // Given
            const id = UserId.create('550e8400-e29b-41d4-a716-446655440000');
            const user1 = User.reconstruct(
                id,
                validEmail,
                validPassword,
                AuthProvider.EMAIL,
                new Date(),
                new Date()
            );
            const user2 = User.reconstruct(
                id,
                Email.create('other@example.com'),
                validPassword,
                AuthProvider.EMAIL,
                new Date(),
                new Date()
            );

            // When & Then
            expect(user1.equals(user2)).toBe(true);
        });

        it('ID가 null인 사용자는 동일하지 않다. (생성시 null)', () => {
            // Given
            const user1 = User.createWithEmail(validEmail, validPassword);
            const user2 = User.createWithEmail(validEmail, validPassword);

            // When & Then
            expect(user1.equals(user2)).toBe(false);
        });

        it('2개의 User객체중 하나만 null이어도 사용자는 동일하지 않다. (생성시 null)', () => {
            // Given
            const id = UserId.create('550e8400-e29b-41d4-a716-446655440000');
            const createdAt = new Date('2024-01-01');
            const updatedAt = new Date('2024-01-02');

            const user1 = User.reconstruct(
                id,
                validEmail,
                null,
                AuthProvider.EMAIL,
                createdAt,
                updatedAt
            );

            const user2 = User.createWithEmail(validEmail, validPassword);

            // When & Then
            expect(user1.equals(user2)).toBe(false);
        });

        it('User가 아닌 객체는 동등하지 않다', () => {
            // Given
            const user = User.createWithEmail(validEmail, validPassword);
            const notUser = { id: user.id } as never;

            // When & Then
            expect(user.equals(notUser)).toBe(false);
        });
    });

    describe('hasPassword', () => {
        it('SSO 사용자는 최초 생성 후 password가 null이기에 hasPassword는 false로 반환된다.', () => {
            // Given
            const user = User.createWithSSO(validEmail);

            expect(user.hasPassword()).toBeFalsy();
        });

        it('Email 사용자는 최초 생성 후 password가 존재하기에 hasPassword는 true 반환된다.', () => {
            // Given
            const user = User.createWithEmail(validEmail, validPassword);

            // When & Then
            expect(user.hasPassword()).toBeTruthy();
        });
    });

    describe('toJSON', () => {
        it('비밀번호를 제외하고 JSON으로 변환한다', () => {
            // Given
            const user = User.createWithEmail(validEmail, validPassword);

            // When
            const json = user.toJSON();

            // Then
            expect(json).toEqual({
                id: user.id?.toString(),
                email: user.email.toString(),
                hasPassword: true,
                authProvider: AuthProvider.EMAIL.toString(),
                createdAt: user.createdAt.toISOString(),
                updatedAt: user.updatedAt.toISOString(),
            });
            expect(json).not.toHaveProperty('password');
        });

        it('SSO 사용자를 JSON으로 변환한다', () => {
            // Given
            const user = User.createWithSSO(validEmail);

            // When
            const json = user.toJSON();

            // Then
            expect(json).toEqual({
                id: user.id?.toString(),
                email: user.email.toString(),
                hasPassword: false,
                authProvider: AuthProvider.GOOGLE.toString(),
                createdAt: user.createdAt.toISOString(),
                updatedAt: user.updatedAt.toISOString(),
            });
            expect(json).not.toHaveProperty('password');
        });
    });
});
