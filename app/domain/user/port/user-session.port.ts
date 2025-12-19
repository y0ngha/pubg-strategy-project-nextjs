import { User } from "../entities/user.entity";

export abstract class UserSessionPort {
    abstract getUser(): User
    
    abstract saveUser(user: User): User

    abstract delete(): void
}