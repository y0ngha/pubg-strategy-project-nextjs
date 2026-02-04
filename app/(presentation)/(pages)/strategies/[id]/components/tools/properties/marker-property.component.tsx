import { Group, Image } from 'react-konva';
import { useLucideIconToSvgUrl } from '@/(presentation)/(pages)/strategies/[id]/hooks/utils/useLucideIconToSvgUrl';
import useImage from 'use-image';
import { MapPin } from 'lucide-react';
import React from 'react';

interface MarkerPropertyProps {
    x: number;
    y: number;
    priority: number;
    color: string;
    isSelectable: boolean;
}

function MarkerProperty({
    x,
    y,
    priority,
    color,
    isSelectable,
}: MarkerPropertyProps) {
    const { url, center } = useLucideIconToSvgUrl(MapPin, {
        color: color,
        size: 112,
        strokeWidth: 1,
        fill: true,
    });

    const [markerImage] = useImage(url ?? '');

    return (
        <Group x={0} y={0} listening={isSelectable}>
            <Image
                x={x}
                y={y}
                image={markerImage}
                offsetX={center}
                offsetY={center}
                scaleX={0.8}
                scaleY={0.8}
                alt={`팀 플레이어 마커 - ${priority}`}
            />
        </Group>
    );
}

MarkerProperty.displayName = 'MarkerProperty';

export default React.memo(MarkerProperty);
