export class LogoutCommand {
    private constructor() {}

    static create(): LogoutCommand {
        return new LogoutCommand();
    }
}
