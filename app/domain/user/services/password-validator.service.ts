import { Email } from '@/domain/shared/value-objects/email';
import { Password } from '../value-objects/password';
import { injectable } from 'inversify';

@injectable()
export class PasswordValidatorService {
    validate(email: Email, password: Password): boolean {
        return password.toString().toLowerCase().search(email.localPart) == -1;
    }
}
