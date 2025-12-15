// infrastructure/adapter/aes-password-cipher.adapter.ts
import { env } from '@/infrastructure/config/environment-variables';
import { PasswordCipherPort } from '@domain/user/port/password-cipher.port';
import crypto from 'crypto';
import { injectable } from 'inversify';

@injectable()
export class PasswordCipherAdapter implements PasswordCipherPort {
    private readonly ALGORITHM = 'aes-256-cbc';
    private readonly IV_LENGTH = 16;

    public encrypt(raw: string): string {
        const iv = crypto.randomBytes(this.IV_LENGTH);

        const cipher = crypto.createCipheriv(
            this.ALGORITHM,
            Buffer.from(env.AES256_SECRET_KEY),
            iv
        );

        let encrypted = cipher.update(raw, 'utf8', 'hex');
        encrypted += cipher.final('hex');

        return `${iv.toString('hex')}:${encrypted}`;
    }

    public decrypt(encryptedText: string): string {
        const textParts = encryptedText.split(':');
        if (textParts.length !== 2) {
            throw new Error(
                'Invalid encrypted text format. Format must be IV:EncryptedData'
            );
        }

        const iv = Buffer.from(textParts[0], 'hex');
        const encryptedData = textParts[1];

        const decipher = crypto.createDecipheriv(
            this.ALGORITHM,
            Buffer.from(env.AES256_SECRET_KEY),
            iv
        );

        let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
        decrypted += decipher.final('utf8');

        return decrypted;
    }
}
