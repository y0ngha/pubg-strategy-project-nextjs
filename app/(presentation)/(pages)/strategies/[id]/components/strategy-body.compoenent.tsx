'use client';

import { useToolbar } from '@/(presentation)/(pages)/strategies/[id]/components/hooks/tools/useToolbar';
import { useLucideIconToCursorUrl } from '@/(presentation)/(pages)/strategies/[id]/components/hooks/utils/useLucideIconToCursorUrl';
import StrategyToolbar from '@/(presentation)/(pages)/strategies/[id]/components/strategy-toolbar.component';
import StrategyCanvas from '@/(presentation)/(pages)/strategies/[id]/components/strategy-canvas.component';
import StrategyMapImage from '@/(presentation)/(pages)/strategies/[id]/components/strategy-map-image.component';
import Konva from 'konva';
import { Ref } from 'react';

interface StrategyBodyProps {
    id: string;
    mapImage: string;
    stageRef: Ref<Konva.Stage>;
    handleMouseMove: () => void;
    mousePosition: { x: number; y: number };
}

function StrategyBody({
    id,
    mapImage,
    stageRef,
    handleMouseMove,
    mousePosition,
}: StrategyBodyProps) {
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
        <div className={'flex h-full flex-1 flex-row'} style={{ cursor: url }}>
            <StrategyToolbar
                canvasToolGroup={canvasToolGroup}
                canvasToolNames={canvasToolNames}
                canvasToolIcons={canvasToolIcons}
                changeTool={changeTool}
                selectedTool={selectedTool}
                iconSize={iconSize}
            />
            <StrategyCanvas
                stageRef={stageRef}
                handleMouseMove={handleMouseMove}
                mousePosition={mousePosition}
                selectedTool={selectedTool}
                map={<StrategyMapImage src={mapImage} />}
                properties={<></>}
            />
        </div>
    );
}

StrategyBody.displayName = 'StrategyBody';

export default StrategyBody;
