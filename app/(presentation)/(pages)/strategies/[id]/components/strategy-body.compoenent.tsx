'use client';

import { useToolbar } from '@/(presentation)/(pages)/strategies/[id]/components/hooks/tools/useToolbar';
import { useLucideIconToSvgUrl } from '@/(presentation)/(pages)/strategies/[id]/components/hooks/utils/useLucideIconToSvgUrl';
import StrategyToolbar from '@/(presentation)/(pages)/strategies/[id]/components/strategy-toolbar.component';
import StrategyCanvas from '@/(presentation)/(pages)/strategies/[id]/components/strategy-canvas.component';
import StrategyMapImage from '@/(presentation)/(pages)/strategies/[id]/components/strategy-map-image.component';
import Konva from 'konva';
import { Ref } from 'react';
import CircleProperty from '@/(presentation)/(pages)/strategies/[id]/components/properties/circle-property.component';
import { Layer } from 'react-konva';
import { useCircleEvent } from '@/(presentation)/(pages)/strategies/[id]/components/hooks/tools/useCircleEvent';
import {
    AirplanePathResponseDto,
    CircleResponseDto,
} from '@/application/strategy/dto/strategy/get-strategy.dto';
import PhaseSelectModal from '@/(presentation)/(pages)/strategies/[id]/components/modals/phase-select.modal';
import { useKonvaHandleMouseClick } from '@/(presentation)/(pages)/strategies/[id]/components/hooks/konvas/useKonvaHandleMouseClick';
import { useAirplanePathEvent } from '@/(presentation)/(pages)/strategies/[id]/components/hooks/tools/useAirplanePathEvent';
import AirplanePathProperty from '@/(presentation)/(pages)/strategies/[id]/components/properties/airplane-path-property.component';

interface StrategyBodyProps {
    id: string;
    mapImage: string;
    stageRef: Ref<Konva.Stage>;
    handleMouseMove: () => void;
    circles: CircleResponseDto[];
    airplanePath?: AirplanePathResponseDto;
}

function CirclesLayer({ circles }: Pick<StrategyBodyProps, 'circles'>) {
    return (
        <Layer>
            {circles.map(field => (
                <CircleProperty
                    key={field.phase}
                    color={field.color}
                    radius={field.radius}
                    x={field.centerPosition.x}
                    y={field.centerPosition.y}
                />
            ))}
        </Layer>
    );
}

function AirplanePathLayer({
    startPosition,
    endPosition,
}: {
    startPosition?: { x: number; y: number };
    endPosition?: { x: number; y: number };
}) {
    return (
        <Layer>
            <AirplanePathProperty
                startPosition={startPosition}
                endPosition={endPosition}
            />
        </Layer>
    );
}

function StrategyBody({
    id,
    mapImage,
    stageRef,
    handleMouseMove,
    circles,
    airplanePath,
}: StrategyBodyProps) {
    const {
        canvasToolGroup,
        canvasToolNames,
        canvasToolIcons,
        changeTool,
        selectedTool,
        iconSize,
    } = useToolbar();

    const { url, center } = useLucideIconToSvgUrl(
        canvasToolIcons[selectedTool]
    );

    const {
        isPhaseSelectModalOpen,
        phaseSelectModalOpen,
        phaseSelectModalClose,
        circleCreate,
    } = useCircleEvent(id);

    const { clickAirplanePath, startPosition, endPosition } =
        useAirplanePathEvent(id, airplanePath);

    const onMapClick = (clickPosition: { x: number; y: number }) => {
        switch (selectedTool) {
            case 'circle':
                return phaseSelectModalOpen(clickPosition);
            case 'airplane':
                return clickAirplanePath(clickPosition);
        }
    };

    const { handleClick } = useKonvaHandleMouseClick((_, clickPosition) => {
        onMapClick(clickPosition);
    });

    return (
        <div
            className={'flex h-full flex-1 flex-row'}
            style={{ cursor: `url('${url}') ${center} ${center}, auto` }}
        >
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
                selectedTool={selectedTool}
                map={<StrategyMapImage src={mapImage} />}
                properties={
                    <>
                        <CirclesLayer circles={circles} />
                        <AirplanePathLayer
                            startPosition={startPosition}
                            endPosition={endPosition}
                        />
                    </>
                }
                onMapClick={handleClick}
            />

            <PhaseSelectModal
                isOpen={isPhaseSelectModalOpen}
                onClose={phaseSelectModalClose}
                onConfirm={circleCreate}
            />
        </div>
    );
}

StrategyBody.displayName = 'StrategyBody';

export default StrategyBody;
