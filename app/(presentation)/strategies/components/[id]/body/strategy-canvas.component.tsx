'use client';

import React, { ReactNode, Ref, useRef, useState } from 'react';
import { Stage } from 'react-konva';
import { useResizeObserver } from '@/(presentation)/shared/hooks/useResizeObserver';
import { useKonvaHandleWheelZoomControl } from '@/(presentation)/strategies/hooks/konvas/useKonvaHandleWheelZoomControl';
import { useKovnaHandleMapDrag } from '@/(presentation)/strategies/hooks/konvas/useKovnaHandleMapDrag';
import Konva from 'konva';
import { KonvaEventObject } from 'konva/lib/Node';

interface StrategyCanvasProps {
    stageRef: Ref<Konva.Stage>;
    handleMouseMove: () => void;
    isDraggable: boolean;
    map: ReactNode;
    properties: ReactNode;
    onMapClick: (event: KonvaEventObject<MouseEvent>) => void;
}

function StrategyCanvas({
    stageRef,
    handleMouseMove,
    isDraggable,
    map,
    properties,
    onMapClick,
}: StrategyCanvasProps) {
    const containerRef = useRef<HTMLDivElement>(null);

    const [stagePosistion, setStagePosistion] = useState({ x: 0, y: 0 });

    const { width, height } = useResizeObserver(containerRef, {
        width: 1500,
        height: 1500,
    });

    const { scale, handleWheel } = useKonvaHandleWheelZoomControl();

    const { handleDragBound, handleDragEnd } = useKovnaHandleMapDrag(scale, {
        width,
        height,
    });

    return (
        <div
            className={'h-full w-full overflow-hidden bg-zinc-900'}
            ref={containerRef}
        >
            <Stage
                ref={stageRef}
                width={width}
                height={height}
                draggable={isDraggable}
                dragBoundFunc={handleDragBound}
                onWheel={event => {
                    const newStagePosition = handleWheel(event);
                    setStagePosistion(newStagePosition);
                }}
                onDragEnd={event => {
                    const newStagePosition = handleDragEnd(event);
                    setStagePosistion(newStagePosition);
                }}
                onClick={onMapClick}
                onMouseMove={handleMouseMove}
                scaleX={scale}
                scaleY={scale}
                x={stagePosistion.x}
                y={stagePosistion.y}
            >
                {map}

                {properties}
            </Stage>
        </div>
    );
}

StrategyCanvas.displayName = 'StrategyCanvas';

export default React.memo(StrategyCanvas);
