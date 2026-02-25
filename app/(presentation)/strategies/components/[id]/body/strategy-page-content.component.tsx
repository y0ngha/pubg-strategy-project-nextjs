'use client';

import StrategyBody from '@/(presentation)/strategies/components/[id]/body/strategy-body.component';
import StrategyHeader from '@/(presentation)/strategies/components/[id]/header/strategy-header.component';
import Skeleton from '@/(presentation)/shared/components/skeleton.component';
import { useKonvaHandleMouseMove } from '@/(presentation)/strategies/hooks/konvas/useKonvaHandleMouseMove';
import StrategyFooter from '@/(presentation)/strategies/components/[id]/footer/strategy-footer.component';
import { useGetStrategy } from '@/(presentation)/strategies/hooks/queries/useGetStrategy';

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
                        enemyTeams={strategy.enemyTeams}
                        teamPlayers={strategy.teamPlayers}
                        tags={strategy.tags}
                        comments={strategy.comments}
                    />
                    <StrategyFooter mousePosition={mousePosition} />
                </>
            )}
        </div>
    );
}

StrategyPageContent.displayName = 'StrategyPageContent';

export default StrategyPageContent;
