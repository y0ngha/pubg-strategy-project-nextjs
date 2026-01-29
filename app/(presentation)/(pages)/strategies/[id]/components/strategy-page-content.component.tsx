'use client';

import { useGetStrategy } from '@/(presentation)/(pages)/strategies/[id]/components/hooks/useGetStrategy';
import StrategyBody from '@/(presentation)/(pages)/strategies/[id]/components/strategy-body.compoenent';
import StrategyHeader from '@/(presentation)/(pages)/strategies/[id]/components/strategy-header.component';

interface StrategyPageContentProps {
    id: string;
}

function StrategyPageContent({ id }: StrategyPageContentProps) {
    const { data: strategy } = useGetStrategy(id);

    if (!strategy) {
        return <></>;
    }

    return (
        <div className={'flex h-full w-full flex-col'}>
            <StrategyHeader id={id} title={strategy.title} />
            <StrategyBody id={id} mapImage={strategy.mapImage} />
        </div>
    );
}

StrategyPageContent.displayName = 'StrategyPageContent';

export default StrategyPageContent;
