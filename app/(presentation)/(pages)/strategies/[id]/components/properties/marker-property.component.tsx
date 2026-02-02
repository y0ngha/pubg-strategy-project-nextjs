import { Image } from 'react-konva';
import { useLucideIconToSvgUrl } from '@/(presentation)/(pages)/strategies/[id]/components/hooks/utils/useLucideIconToSvgUrl';
import useImage from 'use-image';
import { MapPin } from 'lucide-react';

interface MarkerPropertyProps {
    x: number;
    y: number;
    priority: number;
    color: string;
}

function MarkerProperty({ x, y, priority, color }: MarkerPropertyProps) {
    const { url, center } = useLucideIconToSvgUrl(MapPin, {
        color: color,
        size: 112,
        strokeWidth: 1,
        fill: true,
    });

    const [markerImage] = useImage(url ?? '');

    return (
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
    );
}

MarkerProperty.displayName = 'MarkerProperty';

export default MarkerProperty;
