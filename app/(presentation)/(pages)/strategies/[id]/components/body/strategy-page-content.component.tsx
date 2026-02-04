'use client';

import { useGetStrategy } from '@/(presentation)/(pages)/strategies/[id]/hooks/queries/useGetStrategy';
import StrategyBody from '@/(presentation)/(pages)/strategies/[id]/components/body/strategy-body.component';
import StrategyHeader from '@/(presentation)/(pages)/strategies/[id]/components/header/strategy-header.component';
import Skeleton from '@/(presentation)/shared/components/skeleton.component';
import { useKonvaHandleMouseMove } from '@/(presentation)/(pages)/strategies/[id]/hooks/konvas/useKonvaHandleMouseMove';
import StrategyFooter from '@/(presentation)/(pages)/strategies/[id]/components/footer/strategy-footer.component';

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
