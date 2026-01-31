'use client';

import { useToolbar } from '@/(presentation)/(pages)/strategies/[id]/components/hooks/tools/useToolbar';
import { useLucideIconToCursorUrl } from '@/(presentation)/(pages)/strategies/[id]/components/hooks/utils/useLucideIconToCursorUrl';
import StrategyToolbar from '@/(presentation)/(pages)/strategies/[id]/components/strategy-toolbar.component';
import StrategyCanvas from '@/(presentation)/(pages)/strategies/[id]/components/strategy-canvas.component';
import StrategyMapImage from '@/(presentation)/(pages)/strategies/[id]/components/strategy-map-image.component';
import Konva from 'konva';
import { Ref } from 'react';
import CircleProperty from '@/(presentation)/(pages)/strategies/[id]/components/properties/circle-property.component';
import { Layer } from 'react-konva';
import { useCircleEvent } from '@/(presentation)/(pages)/strategies/[id]/components/hooks/tools/useCircleEvent';
import { CircleResponseDto } from '@/application/strategy/dto/strategy/get-strategy.dto';
import PhaseSelectModal from '@/(presentation)/(pages)/strategies/[id]/components/modals/phase-select.modal';
import { useKonvaHandleMouseClick } from '@/(presentation)/(pages)/strategies/[id]/components/hooks/konvas/useKonvaHandleMouseClick';

interface StrategyBodyProps {
    id: string;
    mapImage: string;
    stageRef: Ref<Konva.Stage>;
    handleMouseMove: () => void;
    mousePosition: { x: number; y: number };
    circles: CircleResponseDto[];
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

function StrategyBody({
    id,
    mapImage,
    stageRef,
    handleMouseMove,
    mousePosition,
    circles,
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

    const {
        isPhaseSelectModalOpen,
        phaseSelectModalOpen,
        phaseSelectModalClose,
        onCircleCreateConfirm,
    } = useCircleEvent(id);

    const onMapClick = (clickPosition: { x: number; y: number }) => {
        switch (selectedTool) {
            case 'circle':
                return phaseSelectModalOpen(clickPosition);
        }
    };

    const { handleClick } = useKonvaHandleMouseClick(
        mousePosition,
        (_, clickPosition) => {
            onMapClick(clickPosition);
        }
    );

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
                selectedTool={selectedTool}
                map={<StrategyMapImage src={mapImage} />}
                properties={<CirclesLayer circles={circles} />}
                onMapClick={handleClick}
            />

            <PhaseSelectModal
                isOpen={isPhaseSelectModalOpen}
                onClose={phaseSelectModalClose}
                onConfirm={onCircleCreateConfirm}
            />
        </div>
    );
}

StrategyBody.displayName = 'StrategyBody';

export default StrategyBody;
