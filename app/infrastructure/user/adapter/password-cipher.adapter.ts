import { env } from '@/infrastructure/config/environment-variables';
import { PasswordCipherPort } from '@domain/user/port/password-cipher.port';
import crypto from 'crypto';
import { injectable } from 'inversify';

@injectable()
export class PasswordCipherAdapter implements PasswordCipherPort {
    private readonly ALGORITHM = 'aes-256-gcm';
    private readonly IV_LENGTH = 12;

    public encrypt(raw: string): string {
        const iv = crypto.randomBytes(this.IV_LENGTH);

        const cipher = crypto.createCipheriv(
            this.ALGORITHM,
            Buffer.from(env.AES256_SECRET_KEY),
            iv
        );

        let encrypted = cipher.update(raw, 'utf8', 'hex');
        encrypted += cipher.final('hex');

        const authTag = cipher.getAuthTag();

        return `${iv.toString('hex')}:${encrypted}:${authTag.toString('hex')}`;
    }

    public decrypt(encryptedText: string): string {
        const textParts = encryptedText.split(':');
        if (textParts.length !== 3) {
            throw new Error('Invalid encrypted text format');
        }

        const iv = Buffer.from(textParts[0], 'hex');
        const encryptedData = textParts[1];
        const authTag = Buffer.from(textParts[2], 'hex');

        const decipher = crypto.createDecipheriv(
            this.ALGORITHM,
            Buffer.from(env.AES256_SECRET_KEY),
            iv
        );

        decipher.setAuthTag(authTag);

        try {
            let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
            decrypted += decipher.final('utf8');

            return decrypted;
        } catch (error) {
            console.error(
                `Decryption failed. Data might be corrupted or tampered with.\n${error}`
            );
            throw new Error(`Decryption failed.`);
        }
    }
}
