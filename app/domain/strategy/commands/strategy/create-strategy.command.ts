import { StrategyTitle } from '@domain/strategy/value-objects/strategy-title';
import { PubgMap } from '@domain/strategy/enums/map.enum';

export class CreateStrategyCommand {
    private constructor(
        public readonly title: StrategyTitle,
        public readonly map: PubgMap
    ) {}

    static create(title: StrategyTitle, map: PubgMap) {
        return new CreateStrategyCommand(title, map);
    }
}
