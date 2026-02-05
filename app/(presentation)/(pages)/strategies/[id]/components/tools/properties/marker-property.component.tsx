'use client';

import { Group, Image } from 'react-konva';
import { useLucideIconToSvgUrl } from '@/(presentation)/(pages)/strategies/[id]/hooks/utils/useLucideIconToSvgUrl';
import useImage from 'use-image';
import { MapPin } from 'lucide-react';
import React, { useRef } from 'react';
import { useKonvaHandleHover } from '@/(presentation)/(pages)/strategies/[id]/hooks/konvas/useKonvaHandleHover';
import { useKonvaHandlePropertyDrag } from '@/(presentation)/(pages)/strategies/[id]/hooks/konvas/useKonvaHandlePropertyDrag';
import Konva from 'konva';
import { useKonvaHandleMouseClick } from '@/(presentation)/(pages)/strategies/[id]/hooks/konvas/useKonvaHandleMouseClick';
import SelectionFrame from '@/(presentation)/(pages)/strategies/[id]/components/tools/properties/selection-frame.component';

interface MarkerPropertyProps {
    id: string;
    teamPlayerId: string;
    x: number;
    y: number;
    priority: number;
    color: string;
    isSelectable: boolean;
    isSelected: boolean;
    onClick: (data?: { teamPlayerId: string; id: string }) => void;
    onMove: (
        teamPlayerId: string,
        markerId: string,
        deltaPosition: { x: number; y: number }
    ) => void;
    onDelete: (teamPlayerId: string, markerId: string) => void;
}

function MarkerProperty({
    id,
    teamPlayerId,
    x,
    y,
    priority,
    color,
    isSelectable,
    isSelected,
    onClick,
    onMove,
}: MarkerPropertyProps) {
    const ref = useRef<Konva.Image>(null);

    const {
        handleMouseLeave: hoverHandleMouseLeave,
        handleMouseEnter: hoverHandleMouseEnter,
        scaleX,
        scaleY,
        shadowBlur,
        shadowColor,
        shadowOpacity,
    } = useKonvaHandleHover(color);

    const { handleDragStart, handleDragEnd } = useKonvaHandlePropertyDrag(
        deltaPosition => {
            onMove(teamPlayerId, id, deltaPosition);
        }
    );

    const { handleClick } = useKonvaHandleMouseClick(() => {
        onClick({ teamPlayerId, id });
    });

    const { url, center } = useLucideIconToSvgUrl(MapPin, {
        color: color,
        size: 112,
        strokeWidth: 1,
        fill: true,
    });

    const [markerImage] = useImage(url ?? '');

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
            <Image
                ref={ref}
                x={x}
                y={y}
                image={markerImage}
                offsetX={center}
                offsetY={center}
                scaleX={scaleX}
                scaleY={scaleY}
                shadowBlur={shadowBlur}
                shadowColor={shadowColor}
                shadowOpacity={shadowOpacity}
                alt={`팀 플레이어 마커 - ${priority}`}
                onMouseLeave={hoverHandleMouseLeave}
                onMouseEnter={hoverHandleMouseEnter}
                onClick={handleClick}
            />

            <SelectionFrame
                targetRef={ref}
                isSelected={isSelected}
                onDelete={() => {}}
            />
        </Group>
    );
}

MarkerProperty.displayName = 'MarkerProperty';

export default React.memo(MarkerProperty);
