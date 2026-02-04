'use client';

import { Circle, Group, Shape } from 'react-konva';
import { ORIGINAL_MAP_SIZE } from '@/(presentation)/shared/constants/map';
import React from 'react';
import { StrategyBodyProps } from '@/(presentation)/(pages)/strategies/[id]/components/body/strategy-body.component';
import { useKonvaHandleHover } from '@/(presentation)/(pages)/strategies/[id]/hooks/konvas/useKonvaHandleHover';
import { useKonvaHandlePropertyDrag } from '@/(presentation)/(pages)/strategies/[id]/hooks/konvas/useKonvaHandlePropertyDrag';

interface CirclePropertyProps {
    id: string;
    x: number;
    y: number;
    radius: number;
    color: string;
    isSelectable: boolean;
    onMove: (circleId: string, deltaPosition: { x: number; y: number }) => void;
}

function CircleProperty({
    id,
    x,
    y,
    radius,
    color,
    isSelectable,
}: CirclePropertyProps) {
    const {
        isHovered,
        handleMouseLeave: hoverHandleMouseLeave,
        handleMouseEnter: hoverHandleMouseEnter,
        shadowBlur,
        shadowColor,
        shadowOpacity,
    } = useKonvaHandleHover(color);

    const { handleDragStart, handleDragEnd } = useKonvaHandlePropertyDrag();

    return (
        <Group x={0} y={0}>
            <Shape
                listening={false}
                fill={color}
                sceneFunc={(context, shape) => {
                    context.beginPath();

                    context.rect(0, 0, ORIGINAL_MAP_SIZE, ORIGINAL_MAP_SIZE);

                    context.arc(x, y, radius, 0, Math.PI * 2, false);
                    context.closePath();

                    context.fillStrokeShape(shape);
                }}
                fillRule={'evenodd'}
            />

            <Group
                x={0}
                y={0}
                listening={isSelectable}
                draggable={true}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                onMouseDown={e => {
                    e.cancelBubble = true;
                }}
            >
                <Circle
                    x={x}
                    y={y}
                    radius={radius}
                    stroke={'#ffffff'}
                    strokeWidth={isHovered ? 4 : 2}
                    dash={[10, 10]}
                    fillEnabled={false}
                    hitStrokeWidth={50}
                    shadowBlur={shadowBlur}
                    shadowColor={shadowColor}
                    shadowOpacity={shadowOpacity}
                    onMouseLeave={hoverHandleMouseLeave}
                    onMouseEnter={hoverHandleMouseEnter}
                />
            </Group>
        </Group>
    );
}

CircleProperty.displayName = 'CircleProperty';

function CirclesLayer({
    circles,
    isSelectable,
    onMove,
}: Pick<CirclePropertyProps, 'isSelectable' | 'onMove'> &
    Pick<StrategyBodyProps, 'circles'>) {
    return (
        <>
            {circles.map(field => (
                <CircleProperty
                    key={field.id}
                    id={field.id}
                    color={field.color}
                    radius={field.radius}
                    x={field.centerPosition.x}
                    y={field.centerPosition.y}
                    isSelectable={isSelectable}
                    onMove={onMove}
                />
            ))}
        </>
    );
}

CirclesLayer.displayName = 'CirclesLayer';

export default React.memo(CirclesLayer);
