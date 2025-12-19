import { Email } from '@/domain/shared/value-objects/email';
import { User } from '@/domain/user/entities/user.entity';
import { UserNotFoundException } from '@/domain/user/exceptions/user.exceptions';
import { UserSessionPort } from '@/domain/user/port/user-session.port';
import { Password } from '@/domain/user/value-objects/password';
import { UserSessionAdapter } from '@/infrastructure/user/adapter/user-session.adapter';

describe('UserSessionAdapter (Client)', () => {
    let userSessionPort: UserSessionPort;

    beforeEach(() => {
        userSessionPort = new UserSessionAdapter();
    });

    describe('get', () => {
        it('유저 정보가 없을 경우 에러를 던진다.', () => {
            // When & Then
            expect(() => userSessionPort.getUser()).toThrow(
                new UserNotFoundException()
            );
        });
        it('유저 정보가 있을 경우 유저 Entity를 반환한다.', () => {
            // Give
            const user = User.createWithEmail(
                Email.create('test@test.com'),
                Password.create('Qwer1234@')
            );
            userSessionPort.saveUser(user);

            // When
            const getUserResponse = userSessionPort.getUser();

            expect(getUserResponse).toBe(user);
        });
    });

    describe('save', () => {
        it('파라미터로 전달된 유저의 정보를 그대로 저장한다.', () => {
            // Give
            const oldUser = User.createWithEmail(
                Email.create('old@example.com'),
                Password.create('Qwer1234@')
            );

            // When
            userSessionPort.saveUser(oldUser);

            // Then
            const oldUserResponse = userSessionPort.getUser();
            expect(oldUserResponse).toBe(oldUser);

            // Give
            const newUser = User.createWithEmail(
                Email.create('update@example.com'),
                Password.create('Asdf1234@')
            );

            // When
            userSessionPort.saveUser(newUser);

            // Then
            const newUserResponse = userSessionPort.getUser();

            expect(newUserResponse).not.toBe(oldUser);
            expect(newUserResponse).toBe(newUser);
        });
    });

    describe('clear', () => {
        it('호출시 저장된 User 정보에 상관 없이 삭제처리 되어야 한다.', () => {
            // When
            userSessionPort.clearUser();

            // Then
            expect(() => userSessionPort.getUser()).toThrow(
                new UserNotFoundException()
            );

            // Give
            const user = User.createWithEmail(
                Email.create('test@test.com'),
                Password.create('Qwer1234@')
            );
            userSessionPort.saveUser(user);

            // When
            userSessionPort.clearUser();

            // Then
            expect(() => userSessionPort.getUser()).toThrow(
                new UserNotFoundException()
            );
        });
    });
});
