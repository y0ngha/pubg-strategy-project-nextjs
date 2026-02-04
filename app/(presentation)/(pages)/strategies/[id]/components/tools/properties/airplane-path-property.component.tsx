import { Arrow, Group, Image } from 'react-konva';
import { useLucideIconToSvgUrl } from '@/(presentation)/(pages)/strategies/[id]/hooks/utils/useLucideIconToSvgUrl';
import { Plane } from 'lucide-react';
import useImage from 'use-image';
import React from 'react';
import { useKonvaHandleHover } from '@/(presentation)/(pages)/strategies/[id]/hooks/konvas/useKonvaHandleHover';

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

    const iconColor = '#fbbf24';

    const {
        handleMouseLeave: hoverHandleMouseLeave,
        handleMouseEnter: hoverHandleMouseEnter,
        scaleX,
        scaleY,
        shadowBlur,
        shadowColor,
        shadowOpacity,
    } = useKonvaHandleHover(iconColor);

    const { url, center } = useLucideIconToSvgUrl(Plane, {
        color: iconColor,
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
            <Group
                x={0}
                y={0}
                listening={isSelectable}
                onMouseLeave={hoverHandleMouseLeave}
                onMouseEnter={hoverHandleMouseEnter}
            >
                <Arrow
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
                    scaleX={scaleX}
                    scaleY={scaleY}
                    shadowBlur={shadowBlur}
                    shadowColor={shadowColor}
                    shadowOpacity={shadowOpacity}
                />

                {planeImage && (
                    <Image
                        image={planeImage}
                        x={startPosition.x}
                        y={startPosition.y}
                        offsetX={center}
                        offsetY={center}
                        alt={'비행기 동선 시작'}
                        scaleX={scaleX}
                        scaleY={scaleY}
                        shadowBlur={shadowBlur}
                        shadowColor={shadowColor}
                        shadowOpacity={shadowOpacity}
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
        <>
            <AirplanePathProperty
                startPosition={startPosition}
                endPosition={endPosition}
                isSelectable={isSelectable}
            />
        </>
    );
}

AirplanePathLayer.displayName = 'AirplanePathLayer';

export default React.memo(AirplanePathLayer);
