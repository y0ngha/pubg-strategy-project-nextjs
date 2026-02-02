'use client';

import { Arrow, Circle, Group, Line } from 'react-konva';

interface WaypointPropertyProps {
    positions: { x: number; y: number }[];
    priorty: number;
    color: string;
}

function WaypointProperty({
    positions,
    priorty,
    color,
}: WaypointPropertyProps) {
    const flattenedPoints = positions.flatMap(position => [
        position.x,
        position.y,
    ]);

    const circleBackgroundColor = '#18181B';
    const radius = 32;

    const getAngle = (x1: number, y1: number, x2: number, y2: number) => {
        const dx = x2 - x1;
        const dy = y2 - y1;
        return Math.atan2(dy, dx) * (180 / Math.PI);
    };

    if (positions.length === 0) {
        return <></>;
    }

    return (
        <Group>
            <Line
                points={flattenedPoints}
                stroke={color}
                strokeWidth={6}
                tension={0}
                lineCap={'round'}
                lineJoin={'round'}
                opacity={0.8}
            />

            {positions.map((position, index) => {
                const isLast = index === positions.length - 1;
                let rotation = 0;

                if (!isLast) {
                    const nextPosition = positions[index + 1];
                    rotation = getAngle(
                        position.x,
                        position.y,
                        nextPosition.x,
                        nextPosition.y
                    );
                }

                return (
                    <Group
                        key={`tp-${priorty}-wp-${index}`}
                        x={position.x}
                        y={position.y}
                    >
                        <Circle
                            radius={radius}
                            fill={circleBackgroundColor}
                            stroke={color}
                            strokeWidth={4}
                        />

                        {!isLast && (
                            <Arrow
                                points={[-radius / 3, 0, radius / 3, 0]}
                                pointerLength={radius / 1.5}
                                pointerWidth={radius / 1.5}
                                fill={color}
                                stroke={color}
                                strokeWidth={4}
                                rotation={rotation}
                                offsetX={0}
                                offsetY={0}
                            />
                        )}

                        {isLast && <Circle radius={radius / 2} fill={color} />}
                    </Group>
                );
            })}
        </Group>
    );
}

WaypointProperty.displayName = 'WaypointProperty';

export default WaypointProperty;
