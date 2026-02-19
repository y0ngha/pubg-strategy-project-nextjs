import { StrategyTitle } from '@domain/strategy/value-objects/strategy-title';
import { PubgMap } from '@domain/strategy/enums/map.enum';
import { CreateStrategyCommand } from '@domain/strategy/commands/strategy/create-strategy.command';

describe('CreateStrategyCommand', () => {
    it('전략 생성 Command가 생성된다.', () => {
        // given
        const title = StrategyTitle.create('Test');
        const map = PubgMap.MIRAMAR;

        //when
        const command = CreateStrategyCommand.create(title, map);

        // then
        expect(command).toBeInstanceOf(CreateStrategyCommand);
        expect(command.title).toEqual(title);
        expect(command.map).toEqual(map);
    });
});
