'use client';

import { useGetStrategy } from '@/(presentation)/(pages)/strategies/[id]/components/hooks/useGetStrategy';
import StrategyBody from '@/(presentation)/(pages)/strategies/[id]/components/strategy-body.compoenent';
import StrategyHeader from '@/(presentation)/(pages)/strategies/[id]/components/strategy-header.component';
import Skeleton from '@/(presentation)/shared/components/skeleton.component';
import { useKonvaHandleMouseMove } from '@/(presentation)/(pages)/strategies/[id]/components/hooks/konvas/useKonvaHandleMouseMove';
import StrategyFooter from '@/(presentation)/(pages)/strategies/[id]/components/strategy-footer.component';

interface StrategyPageContentProps {
    id: string;
}

function StrategyPageContent({ id }: StrategyPageContentProps) {
    const { data: strategy, isPending } = useGetStrategy(id);

    const { stageRef, handleMouseMove, mousePosition } =
        useKonvaHandleMouseMove();

    return (
        <div className={'flex h-full w-full flex-col'}>
            {!strategy && isPending && <Skeleton className={'h-full'} />}
            {strategy && (
                <>
                    <StrategyHeader id={id} title={strategy.title} />
                    <StrategyBody
                        id={id}
                        mapImage={strategy.mapImage}
                        stageRef={stageRef}
                        handleMouseMove={handleMouseMove}
                        circles={strategy.circles}
                        airplanePath={strategy.airplanePath}
                    />
                    <StrategyFooter mousePosition={mousePosition} />
                </>
            )}
        </div>
    );
}

StrategyPageContent.displayName = 'StrategyPageContent';

export default StrategyPageContent;
