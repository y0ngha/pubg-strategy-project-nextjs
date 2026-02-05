'use client';

import { Circle, Group, Shape } from 'react-konva';
import { ORIGINAL_MAP_SIZE } from '@/(presentation)/shared/constants/map';
import React, { useRef } from 'react';
import {
    PropertyClickPayload,
    StrategyBodyProps,
} from '@/(presentation)/(pages)/strategies/[id]/components/body/strategy-body.component';
import { useKonvaHandleHover } from '@/(presentation)/(pages)/strategies/[id]/hooks/konvas/useKonvaHandleHover';
import { useKonvaHandlePropertyDrag } from '@/(presentation)/(pages)/strategies/[id]/hooks/konvas/useKonvaHandlePropertyDrag';
import { useKonvaHandleMouseClick } from '@/(presentation)/(pages)/strategies/[id]/hooks/konvas/useKonvaHandleMouseClick';
import SelectionFrame from '@/(presentation)/(pages)/strategies/[id]/components/tools/properties/selection-frame.component';
import Konva from 'konva';

interface CirclePropertyProps {
    id: string;
    x: number;
    y: number;
    radius: number;
    color: string;
    isSelectable: boolean;
    isSelected: boolean;
    onMove: (circleId: string, deltaPosition: { x: number; y: number }) => void;
    onDelete: (circleId: string) => void;
    onClick: ({ type, id }: PropertyClickPayload) => void;
}

function CircleProperty({
    id,
    x,
    y,
    radius,
    color,
    isSelectable,
    isSelected,
    onMove,
    onClick,
    onDelete,
}: CirclePropertyProps) {
    const ref = useRef<Konva.Circle>(null);

    const {
        isHovered,
        handleMouseLeave: hoverHandleMouseLeave,
        handleMouseEnter: hoverHandleMouseEnter,
        shadowBlur,
        shadowColor,
        shadowOpacity,
    } = useKonvaHandleHover(color);

    const { handleDragStart, handleDragEnd } = useKonvaHandlePropertyDrag(
        deltaPosition => {
            onMove(id, deltaPosition);
        }
    );

    const { handleClick } = useKonvaHandleMouseClick(() => {
        onClick({ type: 'circle', id });
    });

    const handleDelete = () => {
        onDelete(id);
    };

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
                onClick={handleClick}
                onMouseDown={e => {
                    e.cancelBubble = true;
                }}
            >
                <Circle
                    ref={ref}
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

                <SelectionFrame
                    targetRef={ref}
                    isSelected={isSelected}
                    onDelete={handleDelete}
                />
            </Group>
        </Group>
    );
}

CircleProperty.displayName = 'CircleProperty';

function CirclesLayer({
    circles,
    isSelectable,
    selectedCircleId,
    onMove,
    onDelete,
    onClick,
}: { selectedCircleId?: string } & Pick<
    CirclePropertyProps,
    'isSelectable' | 'onMove' | 'onDelete' | 'onClick'
> &
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
                    isSelected={selectedCircleId === field.id}
                    onMove={onMove}
                    onDelete={onDelete}
                    onClick={onClick}
                />
            ))}
        </>
    );
}

CirclesLayer.displayName = 'CirclesLayer';

export default React.memo(CirclesLayer);
