'use client';

import { Group, Layer, Shape } from 'react-konva';
import { ORIGINAL_MAP_SIZE } from '@/(presentation)/shared/constants/map';
import React from 'react';
import { StrategyBodyProps } from '@/(presentation)/(pages)/strategies/[id]/components/body/strategy-body.component';

interface CirclePropertyProps {
    x: number;
    y: number;
    radius: number;
    color: string;
    isSelectable: boolean;
}

function CircleProperty({
    x,
    y,
    radius,
    color,
    isSelectable,
}: CirclePropertyProps) {
    return (
        <Group x={0} y={0} listening={isSelectable}>
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

function CirclesLayer({
    circles,
    isSelectable,
}: Pick<CirclePropertyProps, 'isSelectable'> &
    Pick<StrategyBodyProps, 'circles'>) {
    return (
        <Layer>
            {circles.map(field => (
                <CircleProperty
                    key={field.phase}
                    color={field.color}
                    radius={field.radius}
                    x={field.centerPosition.x}
                    y={field.centerPosition.y}
                    isSelectable={isSelectable}
                />
            ))}
        </Layer>
    );
}

CirclesLayer.displayName = 'CirclesLayer';

export default React.memo(CirclesLayer);
