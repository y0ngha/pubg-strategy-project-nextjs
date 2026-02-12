export class WithdrawalCommand {
    private constructor() {}

    static create(): WithdrawalCommand {
        return new WithdrawalCommand();
    }
}
