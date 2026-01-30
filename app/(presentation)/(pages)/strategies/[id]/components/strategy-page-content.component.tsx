'use client';

import { useGetStrategy } from '@/(presentation)/(pages)/strategies/[id]/components/hooks/useGetStrategy';
import StrategyBody from '@/(presentation)/(pages)/strategies/[id]/components/strategy-body.compoenent';
import StrategyHeader from '@/(presentation)/(pages)/strategies/[id]/components/strategy-header.component';
import Skeleton from '@/(presentation)/shared/components/skeleton.component';

interface StrategyPageContentProps {
    id: string;
}

function StrategyPageContent({ id }: StrategyPageContentProps) {
    const { data: strategy, isPending } = useGetStrategy(id);

    return (
        <div className={'flex h-full w-full flex-col'}>
            {!strategy && isPending && <Skeleton className={'h-full'} />}
            {strategy && (
                <>
                    <StrategyHeader id={id} title={strategy.title} />
                    <StrategyBody id={id} mapImage={strategy.mapImage} />
                </>
            )}
        </div>
    );
}

StrategyPageContent.displayName = 'StrategyPageContent';

export default StrategyPageContent;
