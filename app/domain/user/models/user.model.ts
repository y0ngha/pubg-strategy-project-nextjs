import { AuthProvider } from '@domain/user/enums/auth-provider.enum';

export interface User {
    readonly id: string;
    readonly email: string;
    readonly authProvider: AuthProvider;
    readonly hasPassword: boolean;
    readonly createdAt: Date;
    readonly updatedAt: Date;
}
