import { StrategyTitleBlankException } from '@domain/strategy/exceptions/strategy.exceptions';

export class StrategyTitle {
    constructor(public readonly value: string) {}

    static create(title: string) {
        const trimmed = title.trim();

        StrategyTitle.ensureTitleNotBlank(trimmed);

        return new StrategyTitle(trimmed);
    }

    static reconstruct(title: string) {
        return new StrategyTitle(title);
    }

    private static ensureTitleNotBlank(title: string) {
        if (!title || title.length === 0) {
            throw new StrategyTitleBlankException();
        }
    }

    equals(title: StrategyTitle) {
        if (!(title instanceof StrategyTitle)) {
            return false;
        }

        return this.value === title.value;
    }

    toString() {
        return this.value;
    }

    toJSON() {
        return this.value;
    }
}
