import { Arrow, Image } from 'react-konva';
import { useLucideIconToSvgUrl } from '@/(presentation)/(pages)/strategies/[id]/components/hooks/utils/useLucideIconToSvgUrl';
import { Plane } from 'lucide-react';
import useImage from 'use-image';

interface AirplanePathPropertyProps {
    startPosition?: { x: number; y: number };
    endPosition?: { x: number; y: number };
}

function AirplanePathProperty({
    startPosition,
    endPosition,
}: AirplanePathPropertyProps) {
    const isDrawing = startPosition !== undefined && endPosition === undefined;
    const isDrawCompleted =
        startPosition !== undefined && endPosition !== undefined;

    const { url, center } = useLucideIconToSvgUrl(Plane, {
        color: '#fbbf24',
        size: 128,
        strokeWidth: 1,
    });

    const [planeImage] = useImage(url ?? '');

    if (isDrawing) {
        return (
            <Image
                image={planeImage}
                x={startPosition.x}
                y={startPosition.y}
                offsetX={center}
                offsetY={center}
            />

            // <Circle
            //     x={startPosition.x}
            //     y={startPosition.y}
            //     radius={32}
            //     fill={'white'}
            //     stroke={'#fbbf24'}
            //     strokeWidth={5}
            //     opacity={0.8}
            // />
        );
    }

    if (isDrawCompleted) {
        return (
            <>
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
                    />
                )}

                {/*<Circle*/}
                {/*    x={startPosition.x}*/}
                {/*    y={startPosition.y}*/}
                {/*    radius={32}*/}
                {/*    fill={'#fbbf24'}*/}
                {/*/>*/}
            </>
        );
    }

    return <></>;
}

AirplanePathProperty.displayName = 'AirplanePathProperty';

export default AirplanePathProperty;
