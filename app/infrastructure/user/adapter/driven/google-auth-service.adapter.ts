import { GoogleAuthServicePort } from '@/domain/user/port/out/google-auth-service.port';

export class GoogleAuthServiceAdapter extends GoogleAuthServicePort {
    getToken(): Promise<string> {
        throw new Error('Not Implemented.');
    }
}
