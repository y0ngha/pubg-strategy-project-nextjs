import { AuthProvider } from '@domain/user/enums/auth-provider.enum';

export interface User {
    id: string;
    email: string;
    authProvider: AuthProvider;
    hasPassword: boolean;
    createdAt: Date;
    updatedAt: Date;
}
