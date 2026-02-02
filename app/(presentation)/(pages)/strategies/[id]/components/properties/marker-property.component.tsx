import { Image } from 'react-konva';
import { useLucideIconToSvgUrl } from '@/(presentation)/(pages)/strategies/[id]/components/hooks/utils/useLucideIconToSvgUrl';
import useImage from 'use-image';
import { MapPin } from 'lucide-react';

interface MarkerPropertyProps {
    x: number;
    y: number;
    priorty: number;
    color: string;
}

function MarkerProperty({ x, y, priorty, color }: MarkerPropertyProps) {
    const { url, center } = useLucideIconToSvgUrl(MapPin, {
        color: color,
        size: 96,
        strokeWidth: 1,
        fill: false,
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
            alt={`팀 플레이어 마커 - ${priorty}`}
        />
    );
}

MarkerProperty.displayName = 'MarkerProperty';

export default MarkerProperty;
