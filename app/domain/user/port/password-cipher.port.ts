export interface PasswordCipherPort {
    encrypt(raw: string): string;
    decrypt(encryptedValue: string): string;
}
