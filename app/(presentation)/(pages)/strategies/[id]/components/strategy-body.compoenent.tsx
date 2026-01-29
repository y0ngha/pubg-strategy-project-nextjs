import { useToolbar } from '@/(presentation)/(pages)/strategies/[id]/components/hooks/useToolbar';
import { useLucideIconToCursorUrl } from '@/(presentation)/(pages)/strategies/[id]/components/hooks/useLucideIconToCursorUrl';
import StrategyToolbar from '@/(presentation)/(pages)/strategies/[id]/components/strategy-toolbar.component';
import StrategyCanvas from '@/(presentation)/(pages)/strategies/[id]/components/strategy-canvas.component';
import StrategyMapImage from '@/(presentation)/(pages)/strategies/[id]/components/strategy-map-image.component';

interface StrategyBodyProps {
    id: string;
    mapImage: string;
}

function StrategyBody({ id, mapImage }: StrategyBodyProps) {
    const {
        canvasToolGroup,
        canvasToolNames,
        canvasToolIcons,
        changeTool,
        selectedTool,
        iconSize,
    } = useToolbar();

    const { url } = useLucideIconToCursorUrl(canvasToolIcons[selectedTool]);

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
                map={<StrategyMapImage src={mapImage} />}
                properties={<></>}
            />
        </div>
    );
}

StrategyBody.displayName = 'StrategyBody';

export default StrategyBody;
