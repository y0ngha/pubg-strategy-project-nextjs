'use client';

import { CanvasTool } from '@/(presentation)/(pages)/strategies/[id]/components/hooks/useToolbar';
import { ReactNode, useRef, useState } from 'react';
import { Layer, Stage } from 'react-konva';
import { useResizeObserver } from '@/(presentation)/(pages)/strategies/[id]/components/hooks/useResizeObserver';
import { useKonvaHandleWheelZoomControl } from '@/(presentation)/(pages)/strategies/[id]/components/hooks/useKonvaHandleWheelZoomControl';
import { useKovnaHandleDrag } from '@/(presentation)/(pages)/strategies/[id]/components/hooks/useKovnaHandleDrag';

interface StrategyCanvasProps {
    selectedTool: CanvasTool;
    map: ReactNode;
    properties: ReactNode;
}

function StrategyCanvas({
    selectedTool,
    map,
    properties,
}: StrategyCanvasProps) {
    const containerRef = useRef<HTMLDivElement>(null);

    const [stagePosistion, setStagePosistion] = useState({ x: 0, y: 0 });

    const { width, height } = useResizeObserver(containerRef);

    const { scale, handleWheel } = useKonvaHandleWheelZoomControl();

    const { handleDragBound, handleDragEnd } = useKovnaHandleDrag(scale, {
        width,
        height,
    });

    return (
        <div
            className={'h-full w-full overflow-hidden bg-zinc-900'}
            ref={containerRef}
        >
            <Stage
                width={width}
                height={height}
                draggable={true}
                dragBoundFunc={handleDragBound}
                onWheel={event => {
                    const newStagePosition = handleWheel(event);
                    setStagePosistion(newStagePosition);
                }}
                onDragEnd={event => {
                    const newStagePosition = handleDragEnd(event);
                    setStagePosistion(newStagePosition);
                }}
                scaleX={scale}
                scaleY={scale}
                x={stagePosistion.x}
                y={stagePosistion.y}
            >
                <Layer imageSmoothingEnabled={true}>{map}</Layer>
                <Layer>{properties}</Layer>
            </Stage>
        </div>
    );
}

StrategyCanvas.displayName = 'StrategyCanvas';

export default StrategyCanvas;
