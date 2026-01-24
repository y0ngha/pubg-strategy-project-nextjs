import { StrategyPost } from '@/(presentation)/shared/types/strategy';
import StrategiesTable from '@/(presentation)/(pages)/strategies/components/strategies-table.component';

function SharedStrategies() {
    const stratiges: StrategyPost[] = [];

    return <StrategiesTable strategies={stratiges} />;
}

SharedStrategies.displayName = 'SharedStrategies';

export default SharedStrategies;
