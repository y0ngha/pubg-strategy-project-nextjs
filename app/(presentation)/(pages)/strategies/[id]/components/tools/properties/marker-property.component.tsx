import { Group, Image } from 'react-konva';
import { useLucideIconToSvgUrl } from '@/(presentation)/(pages)/strategies/[id]/hooks/utils/useLucideIconToSvgUrl';
import useImage from 'use-image';
import { MapPin } from 'lucide-react';
import React from 'react';
import { useKonvaHandleHover } from '@/(presentation)/(pages)/strategies/[id]/hooks/konvas/useKonvaHandleHover';
import { useKonvaHandlePropertyDrag } from '@/(presentation)/(pages)/strategies/[id]/hooks/konvas/useKonvaHandlePropertyDrag';

interface MarkerPropertyProps {
    id: string;
    teamPlayerId: string;
    x: number;
    y: number;
    priority: number;
    color: string;
    isSelectable: boolean;
    onMove: (
        teamPlayerId: string,
        markerId: string,
        deltaPosition: { x: number; y: number }
    ) => void;
}

function MarkerProperty({
    id,
    teamPlayerId,
    x,
    y,
    priority,
    color,
    isSelectable,
    onMove,
}: MarkerPropertyProps) {
    const {
        handleMouseLeave: hoverHandleMouseLeave,
        handleMouseEnter: hoverHandleMouseEnter,
        scaleX,
        scaleY,
        shadowBlur,
        shadowColor,
        shadowOpacity,
    } = useKonvaHandleHover(color);

    const { handleDragStart, handleDragEnd } = useKonvaHandlePropertyDrag();

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
            onMouseLeave={hoverHandleMouseLeave}
            onMouseEnter={hoverHandleMouseEnter}
        >
            <Image
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
            />
        </Group>
    );
}

MarkerProperty.displayName = 'MarkerProperty';

export default React.memo(MarkerProperty);
