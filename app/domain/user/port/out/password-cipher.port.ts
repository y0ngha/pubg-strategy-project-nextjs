export abstract class PasswordCipherPort {
    abstract encrypt(raw: string): string;
    
    abstract decrypt(encryptedValue: string): string;
}
