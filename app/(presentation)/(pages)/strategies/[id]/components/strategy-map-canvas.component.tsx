'use client';

import { Layer, Stage } from 'react-konva';
import StrategyMapImage from '@/(presentation)/(pages)/strategies/[id]/components/strategy-map-image.component';
import { useKonvaHandleWheelZoomControl } from '@/(presentation)/(pages)/strategies/[id]/components/hooks/useKonvaHandleWheelZoomControl';
import { ReactNode, useRef } from 'react';
import { PubgMap } from '@domain/strategy/enums/map.enum';
import { useResizeObserver } from '@/(presentation)/(pages)/strategies/[id]/components/hooks/useResizeObserver';

interface StrategyMapCanvasProps {
    map: PubgMap;
    children?: ReactNode;
}

const MAP_ASSETS: Record<PubgMap, string> = {
    [PubgMap.ERANGEL]: '/images/maps/Erangel.webp',
    [PubgMap.MIRAMAR]: '/images/maps/Miramar.webp',
    [PubgMap.TAEGO]: '/images/maps/Taego.webp',
    [PubgMap.RONDO]: '/images/maps/Rondo.webp',
    [PubgMap.SANHOK]: '/images/maps/Sanhok.webp',
    [PubgMap.VIKENDI]: '/images/maps/Vikendi.webp',
    [PubgMap.KARAKIN]: '/images/maps/Karakin.webp',
    [PubgMap.HAVEN]: '/images/maps/Haven.webp',
    [PubgMap.DESTON]: '/images/maps/Deston.webp',
};

function StrategyMapCanvas({ map, children }: StrategyMapCanvasProps) {
    const { scale, stagePosistion, handleWheel } =
        useKonvaHandleWheelZoomControl();

    const containerRef = useRef<HTMLDivElement>(null);
    const { width, height } = useResizeObserver(containerRef);

    return (
        <div
            className={'h-full w-full overflow-hidden bg-zinc-900'}
            ref={containerRef}
        >
            <Stage
                width={width}
                height={height}
                draggable={true}
                onWheel={handleWheel}
                scaleX={scale}
                scaleY={scale}
                x={stagePosistion.x}
                y={stagePosistion.y}
            >
                <Layer imageSmoothingEnabled={true}>
                    <StrategyMapImage src={MAP_ASSETS[map]} />
                </Layer>

                <Layer>{children}</Layer>
            </Stage>
        </div>
    );
}

StrategyMapCanvas.displayName = 'StrategyMapCanvas';

export default StrategyMapCanvas;
