import { Arrow, Group, Image, Layer } from 'react-konva';
import { useLucideIconToSvgUrl } from '@/(presentation)/(pages)/strategies/[id]/hooks/utils/useLucideIconToSvgUrl';
import { Plane } from 'lucide-react';
import useImage from 'use-image';
import React from 'react';

interface AirplanePathPropertyProps {
    startPosition?: { x: number; y: number };
    endPosition?: { x: number; y: number };
    isSelectable: boolean;
}

function AirplanePathProperty({
    startPosition,
    endPosition,
    isSelectable,
}: AirplanePathPropertyProps) {
    const isDrawing = startPosition !== undefined && endPosition === undefined;
    const isDrawCompleted =
        startPosition !== undefined && endPosition !== undefined;

    const { url, center } = useLucideIconToSvgUrl(Plane, {
        color: '#fbbf24',
        size: 128,
        strokeWidth: 1,
        fill: true,
    });

    const [planeImage] = useImage(url ?? '');

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
            <Group x={0} y={0} listening={isSelectable}>
                <Arrow
                    points={[
                        startPosition.x,
                        startPosition.y,
                        endPosition.x,
                        endPosition.y,
                    ]}
                    stroke={'#fbbf24'}
                    fill={'#fbbf24'}
                    strokeWidth={32}
                    pointerLength={32}
                    pointerWidth={32}
                    dash={[30, 30]}
                    opacity={0.9}
                    listening={false}
                />

                {planeImage && (
                    <Image
                        image={planeImage}
                        x={startPosition.x}
                        y={startPosition.y}
                        offsetX={center}
                        offsetY={center}
                        alt={'비행기 동선 시작'}
                    />
                )}
            </Group>
        );
    }

    return <></>;
}

AirplanePathProperty.displayName = 'AirplanePathProperty';

function AirplanePathLayer({
    startPosition,
    endPosition,
    isSelectable,
}: AirplanePathPropertyProps) {
    return (
        <Layer>
            <AirplanePathProperty
                startPosition={startPosition}
                endPosition={endPosition}
                isSelectable={isSelectable}
            />
        </Layer>
    );
}

AirplanePathLayer.displayName = 'AirplanePathLayer';

export default React.memo(AirplanePathLayer);
