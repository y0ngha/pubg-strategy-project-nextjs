'use client';

import { Arrow, Group, Image } from 'react-konva';
import { useLucideIconToSvgUrl } from '@/(presentation)/(pages)/strategies/[id]/hooks/utils/useLucideIconToSvgUrl';
import { Plane } from 'lucide-react';
import useImage from 'use-image';
import React, { useRef } from 'react';
import { useKonvaHandleHover } from '@/(presentation)/(pages)/strategies/[id]/hooks/konvas/useKonvaHandleHover';
import { useKonvaHandlePropertyDrag } from '@/(presentation)/(pages)/strategies/[id]/hooks/konvas/useKonvaHandlePropertyDrag';
import SelectionFrame from '@/(presentation)/(pages)/strategies/[id]/components/tools/properties/selection-frame.component';
import Konva from 'konva';
import { useKonvaHandleMouseClick } from '@/(presentation)/(pages)/strategies/[id]/hooks/konvas/useKonvaHandleMouseClick';
import { PropertyClickPayload } from '@/(presentation)/(pages)/strategies/[id]/components/body/strategy-body.component';

interface AirplanePathPropertyProps {
    id?: string;
    startPosition?: { x: number; y: number };
    endPosition?: { x: number; y: number };
    isSelectable: boolean;
    isSelected: boolean;
    onMove: (
        airplanePathId: string,
        deltaPosition: { x: number; y: number }
    ) => void;
    onDelete: (airplanePathId: string) => void;
    onClick: ({ type, id }: PropertyClickPayload) => void;
}

function AirplanePathProperty({
    id,
    startPosition,
    endPosition,
    isSelectable,
    isSelected,
    onMove,
    onClick,
    onDelete,
}: AirplanePathPropertyProps) {
    const ref = useRef<Konva.Arrow>(null);

    const isDrawing = startPosition !== undefined && endPosition === undefined;
    const isDrawCompleted =
        startPosition !== undefined && endPosition !== undefined;

    const iconColor = '#fbbf24';

    const {
        handleMouseLeave: hoverHandleMouseLeave,
        handleMouseEnter: hoverHandleMouseEnter,
        shadowBlur,
        shadowColor,
        shadowOpacity,
    } = useKonvaHandleHover(iconColor);

    const { handleDragStart, handleDragEnd } = useKonvaHandlePropertyDrag(
        deltaPosition => {
            if (id) {
                onMove(id, deltaPosition);
            }
        }
    );

    const { handleClick } = useKonvaHandleMouseClick(() => {
        if (id) {
            onClick({ type: 'airplane', id });
        }
    });

    const { url, center } = useLucideIconToSvgUrl(Plane, {
        color: iconColor,
        size: 128,
        strokeWidth: 1,
        fill: true,
    });

    const [planeImage] = useImage(url ?? '');

    const handleDelete = () => {
        if (id) {
            onDelete(id);
        }
    };

    if (isDrawing) {
        return (
            <Group x={0} y={0} listening={false}>
                <Image
                    image={planeImage}
                    x={startPosition.x}
                    y={startPosition.y}
                    offsetX={center}
                    offsetY={center}
                    alt={'비행기 동선 시작'}
                />
            </Group>
        );
    }

    if (isDrawCompleted) {
        return (
            <Group
                x={0}
                y={0}
                listening={isSelectable}
                draggable={true}
                onMouseDown={event => {
                    event.cancelBubble = true;
                }}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
            >
                <Arrow
                    ref={ref}
                    points={[
                        startPosition.x,
                        startPosition.y,
                        endPosition.x,
                        endPosition.y,
                    ]}
                    stroke={iconColor}
                    fill={iconColor}
                    strokeWidth={32}
                    pointerLength={32}
                    pointerWidth={32}
                    dash={[30, 30]}
                    opacity={0.9}
                    shadowBlur={shadowBlur}
                    shadowColor={shadowColor}
                    shadowOpacity={shadowOpacity}
                    onMouseLeave={hoverHandleMouseLeave}
                    onMouseEnter={hoverHandleMouseEnter}
                    onClick={handleClick}
                />

                <SelectionFrame
                    targetRef={ref}
                    isSelected={isSelected}
                    onDelete={handleDelete}
                />
            </Group>
        );
    }

    return <></>;
}

AirplanePathProperty.displayName = 'AirplanePathProperty';

function AirplanePathLayer({
    id,
    startPosition,
    endPosition,
    isSelectable,
    selectedAirplanePathId,
    onMove,
    onDelete,
    onClick,
}: { selectedAirplanePathId?: string } & Omit<
    AirplanePathPropertyProps,
    'isSelected'
>) {
    return (
        <AirplanePathProperty
            id={id}
            startPosition={startPosition}
            endPosition={endPosition}
            isSelectable={isSelectable}
            isSelected={selectedAirplanePathId === id}
            onMove={onMove}
            onDelete={onDelete}
            onClick={onClick}
        />
    );
}

AirplanePathLayer.displayName = 'AirplanePathLayer';

export default React.memo(AirplanePathLayer);
