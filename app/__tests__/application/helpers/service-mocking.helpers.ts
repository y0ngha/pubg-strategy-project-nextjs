import { PasswordCipherPort } from '@domain/user/port/out/password-cipher.port';
import { AuthenticationServicePort } from '@domain/user/port/out/authentication-service.port';
import { GoogleAuthServicePort } from '@domain/user/port/out/google-auth-service.port';
import { PasswordValidatorPort } from '@domain/user/port/in/password-validator.port';

export function getPasswordCipherMocking(): jest.Mocked<PasswordCipherPort> {
    return {
        encrypt: jest.fn(),
        decrypt: jest.fn(),
    };
}

export function getPasswordValidatorServiceMocking(): jest.Mocked<PasswordValidatorPort> {
    return {
        passwordDifferentValidate: jest.fn(),
    };
}

export function getAuthenticationServiceMocking(): jest.Mocked<AuthenticationServicePort> {
    return {
        login: jest.fn(),
        logout: jest.fn(),
        googleLogin: jest.fn(),
    };
}

export function getGoogleAuthServiceMocking(): jest.Mocked<GoogleAuthServicePort> {
    return {
        getToken: jest.fn(),
    };
}
