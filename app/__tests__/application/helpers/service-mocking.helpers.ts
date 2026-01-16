import { PasswordCipherPort } from '@domain/user/port/out/password-cipher.port';
import { PasswordValidatorService } from '@domain/user/services/password-validator.service';
import { AuthenticationServicePort } from '@domain/user/port/out/authentication-service.port';
import { GoogleAuthServicePort } from '@domain/user/port/out/google-auth-service.port';

export function getPasswordCipherMocking(): jest.Mocked<PasswordCipherPort> {
    return {
        encrypt: jest.fn(),
        decrypt: jest.fn(),
    };
}

export function getPasswordValidatorServiceMocking(): jest.Mocked<PasswordValidatorService> {
    return {
        validate: jest.fn(),
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
