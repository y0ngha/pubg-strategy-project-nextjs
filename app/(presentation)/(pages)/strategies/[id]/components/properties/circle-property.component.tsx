'use client';

import { Group, Shape } from 'react-konva';
import { ORIGINAL_MAP_SIZE } from '@/(presentation)/shared/constants/map';

interface CirclePropertyProps {
    x: number;
    y: number;
    radius: number;
    color: string;
}

function CircleProperty({ x, y, radius, color }: CirclePropertyProps) {
    return (
        <Group>
            <Shape
                fill={color}
                listening={true}
                sceneFunc={(context, shape) => {
                    context.beginPath();

                    context.rect(0, 0, ORIGINAL_MAP_SIZE, ORIGINAL_MAP_SIZE);

                    context.arc(x, y, radius, 0, Math.PI * 2, false);
                    context.closePath();

                    context.fillStrokeShape(shape);
                }}
                fillRule={'evenodd'}
            />
        </Group>
    );
}

CircleProperty.displayName = 'CircleProperty';

export default CircleProperty;
