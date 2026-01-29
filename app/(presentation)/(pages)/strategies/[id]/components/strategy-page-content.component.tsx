'use client';

import StrategyToolbar from '@/(presentation)/(pages)/strategies/[id]/components/strategy-toolbar.component';
import StrategyCanvas from '@/(presentation)/(pages)/strategies/[id]/components/strategy-canvas.component';
import { useToolbar } from '@/(presentation)/(pages)/strategies/[id]/components/hooks/useToolbar';
import { useLucideIconToCursorUrl } from '@/(presentation)/(pages)/strategies/[id]/components/hooks/useLucideIconToCursorUrl';
import StrategyMapImage from '@/(presentation)/(pages)/strategies/[id]/components/strategy-map-image.component';
import { useGetStrategy } from '@/(presentation)/(pages)/strategies/[id]/components/hooks/useGetStrategy';

interface StrategyPageContentProps {
    id: string;
}

function StrategyPageContent({ id }: StrategyPageContentProps) {
    const {
        canvasToolGroup,
        canvasToolNames,
        canvasToolIcons,
        changeTool,
        selectedTool,
        iconSize,
    } = useToolbar();

    const { url } = useLucideIconToCursorUrl(canvasToolIcons[selectedTool]);

    const { data: strategy } = useGetStrategy(id);

    if (!strategy) {
        return <></>;
    }

    return (
        <div className={'flex h-full w-full flex-row'} style={{ cursor: url }}>
            <StrategyToolbar
                canvasToolGroup={canvasToolGroup}
                canvasToolNames={canvasToolNames}
                canvasToolIcons={canvasToolIcons}
                changeTool={changeTool}
                selectedTool={selectedTool}
                iconSize={iconSize}
            />
            <StrategyCanvas
                selectedTool={selectedTool}
                map={<StrategyMapImage src={strategy.mapImage} />}
                properties={<></>}
            />
        </div>
    );
}

StrategyPageContent.displayName = 'StrategyPageContent';

export default StrategyPageContent;
