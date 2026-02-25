'use client';

import { Arrow, Circle, Group, Line } from 'react-konva';
import React, { useRef } from 'react';
import { useKonvaHandleHover } from '@/(presentation)/strategies/hooks/konvas/useKonvaHandleHover';
import { useKonvaHandlePropertyDrag } from '@/(presentation)/strategies/hooks/konvas/useKonvaHandlePropertyDrag';
import { useKonvaHandleMouseClick } from '@/(presentation)/strategies/hooks/konvas/useKonvaHandleMouseClick';
import SelectionFrame from '@/(presentation)/strategies/components/[id]/tools/properties/selection-frame.component';
import Konva from 'konva';
import { PropertyClickPayload } from '@/(presentation)/strategies/components/[id]/body/strategy-body.component';

interface WaypointPropertyProps {
    id?: string;
    teamPlayerId: string;
    positions: { x: number; y: number }[];
    priority: number;
    color: string;
    isDrawing: boolean;
    isSelectable: boolean;
    isSelected: boolean;
    onClick: ({ type, id }: PropertyClickPayload) => void;
    onMove: (
        teamPlayerId: string,
        waypointId: string,
        deltaPosition: { x: number; y: number }
    ) => void;
    onDelete: (teamPlayerId: string, waypointId: string) => void;
}

function WaypointProperty({
    id,
    teamPlayerId,
    positions,
    priority,
    color,
    isDrawing,
    isSelectable,
    isSelected,
    onClick,
    onMove,
    onDelete,
}: WaypointPropertyProps) {
    const ref = useRef<Konva.Group>(null);

    const {
        handleMouseLeave: hoverHandleMouseLeave,
        handleMouseEnter: hoverHandleMouseEnter,
        scaleX,
        scaleY,
        shadowBlur,
        shadowColor,
        shadowOpacity,
    } = useKonvaHandleHover(color);

    const { handleDragStart, handleDragEnd } = useKonvaHandlePropertyDrag(
        deltaPosition => {
            if (id) {
                onMove(teamPlayerId, id, deltaPosition);
            }
        }
    );

    const { handleClick } = useKonvaHandleMouseClick(() => {
        if (id) {
            onClick({ type: 'waypoint', id, teamPlayerId });
        }
    });

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

    const handleDelete = () => {
        if (id) {
            onDelete(teamPlayerId, id);
        }
    };

    if (positions.length === 0) {
        return <></>;
    }

    return (
        <Group
            x={0}
            y={0}
            listening={isSelectable}
            draggable={!isDrawing}
            onMouseDown={event => {
                event.cancelBubble = true;
            }}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
        >
            <Group
                ref={ref}
                onMouseEnter={hoverHandleMouseEnter}
                onMouseLeave={hoverHandleMouseLeave}
                onClick={handleClick}
            >
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
                            key={`tp-${priority}-wp-${index}`}
                            x={position.x}
                            y={position.y}
                        >
                            <Circle
                                radius={radius}
                                fill={circleBackgroundColor}
                                stroke={color}
                                strokeWidth={4}
                                scaleX={scaleX}
                                scaleY={scaleY}
                                shadowBlur={shadowBlur}
                                shadowColor={shadowColor}
                                shadowOpacity={shadowOpacity}
                            />

                            {((!isLast && !isDrawing) || isDrawing) && (
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
                                    scaleX={scaleX}
                                    scaleY={scaleY}
                                    shadowBlur={shadowBlur}
                                    shadowColor={shadowColor}
                                    shadowOpacity={shadowOpacity}
                                />
                            )}

                            {isLast && !isDrawing && (
                                <Circle
                                    radius={radius / 2}
                                    fill={color}
                                    scaleX={scaleX}
                                    scaleY={scaleY}
                                    shadowBlur={shadowBlur}
                                    shadowColor={shadowColor}
                                    shadowOpacity={shadowOpacity}
                                />
                            )}
                        </Group>
                    );
                })}
            </Group>

            <SelectionFrame
                targetRef={ref}
                isSelected={isSelected}
                onDelete={handleDelete}
            />
        </Group>
    );
}

WaypointProperty.displayName = 'WaypointProperty';

export default React.memo(WaypointProperty);
