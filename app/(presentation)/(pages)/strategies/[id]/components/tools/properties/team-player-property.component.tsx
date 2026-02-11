'use client';

import { Circle, Group, Image, Label, Tag, Text } from 'react-konva';
import { useLucideIconToSvgUrl } from '@/(presentation)/(pages)/strategies/[id]/hooks/utils/useLucideIconToSvgUrl';
import useImage from 'use-image';
import { User } from 'lucide-react';
import {
    PropertyClickPayload,
    StrategyBodyProps,
} from '@/(presentation)/(pages)/strategies/[id]/components/body/strategy-body.component';
import React, { useRef } from 'react';
import { useKonvaHandleHover } from '@/(presentation)/(pages)/strategies/[id]/hooks/konvas/useKonvaHandleHover';
import { useKonvaHandlePropertyDrag } from '@/(presentation)/(pages)/strategies/[id]/hooks/konvas/useKonvaHandlePropertyDrag';
import { useKonvaHandleMouseClick } from '@/(presentation)/(pages)/strategies/[id]/hooks/konvas/useKonvaHandleMouseClick';
import Konva from 'konva';
import SelectionFrame from '@/(presentation)/(pages)/strategies/[id]/components/tools/properties/selection-frame.component';

interface TeamPlayerPropertyProps {
    id: string;
    x: number;
    y: number;
    priority: number;
    color: string;
    isSelected: boolean;
    onClick: ({ type, id }: PropertyClickPayload) => void;
    isSelectable: boolean;
    onMove: (
        teamPlayerId: string,
        deltaPosition: { x: number; y: number }
    ) => void;
    onDelete: (teamPlayerId: string) => void;
}

function TeamPlayerProperty({
    id,
    x,
    y,
    priority,
    color,
    isSelectable,
    isSelected,
    onClick,
    onMove,
    onDelete,
}: TeamPlayerPropertyProps) {
    const ref = useRef<Konva.Circle>(null);

    const iconColor = '#ffffff';

    const {
        handleMouseLeave: hoverHandleMouseLeave,
        handleMouseEnter: hoverHandleMouseEnter,
        scaleX,
        scaleY,
        shadowBlur,
        shadowColor,
        shadowOpacity,
    } = useKonvaHandleHover(iconColor);

    const { handleDragStart, handleDragEnd } = useKonvaHandlePropertyDrag(
        deltaPosition => {
            onMove(id, deltaPosition);
        }
    );

    const { url, center } = useLucideIconToSvgUrl(User, {
        color: iconColor,
        size: 64,
        strokeWidth: 2,
        fill: false,
    });

    const [teamPlayerImage] = useImage(url ?? '');

    const radius = 50;

    const { handleClick } = useKonvaHandleMouseClick(() => {
        onClick({ type: 'team', id });
    });

    const handleDelete = () => {
        onDelete(id);
    };

    return (
        <Group
            x={0}
            y={0}
            listening={isSelectable}
            draggable={true}
            onMouseDown={event => {
                event.cancelBubble = true;
            }}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
        >
            <Group
                onClick={handleClick}
                onMouseEnter={hoverHandleMouseEnter}
                onMouseLeave={hoverHandleMouseLeave}
            >
                <Circle
                    ref={ref}
                    x={x}
                    y={y}
                    radius={isSelected ? radius + 20 : radius}
                    fill={`${color}33`}
                    stroke={color}
                    strokeWidth={isSelected ? 3 : 1}
                    dash={isSelected ? [30, 30] : undefined}
                    scaleX={isSelected ? 1.2 : scaleX}
                    scaleY={isSelected ? 1.2 : scaleY}
                    shadowBlur={shadowBlur}
                    shadowColor={shadowColor}
                    shadowOpacity={shadowOpacity}
                />

                <Image
                    image={teamPlayerImage}
                    x={x}
                    y={y}
                    offsetX={center}
                    offsetY={center}
                    scaleX={scaleX}
                    scaleY={scaleY}
                    shadowBlur={shadowBlur}
                    shadowColor={shadowColor}
                    shadowOpacity={shadowOpacity}
                    alt={`팀 플레이어 - ${priority}`}
                />

                <Label x={x} y={y + radius + 8}>
                    <Tag
                        fill={'#18181b'}
                        stroke={color}
                        strokeWidth={1}
                        cornerRadius={4}
                        opacity={0.8}
                        pointerDirection={'up'}
                        pointerWidth={10}
                        pointerHeight={5}
                    />
                    <Text
                        text={priority.toString()}
                        fontSize={32}
                        padding={6}
                        fill={'white'}
                        align={'center'}
                    />
                </Label>
            </Group>

            <SelectionFrame
                targetRef={ref}
                isSelected={isSelected}
                onDelete={handleDelete}
            />
        </Group>
    );
}

TeamPlayerProperty.displayName = 'TeamPlayerProperty';

function TeamPlayersLayer({
    teamPlayers,
    isSelectable,
    selectedTeamPlayerId,
    onClick,
    onMove,
    onDelete,
}: { selectedTeamPlayerId?: string } & Pick<
    TeamPlayerPropertyProps,
    'isSelectable' | 'onMove' | 'onDelete' | 'onClick'
> &
    Pick<StrategyBodyProps, 'teamPlayers'>) {
    return (
        <>
            {teamPlayers.map(field => {
                const isTeamPlayerSelected = selectedTeamPlayerId === field.id;

                return (
                    <TeamPlayerProperty
                        key={`tp-${field.id}`}
                        id={field.id}
                        x={field.position.x}
                        y={field.position.y}
                        priority={field.priority}
                        color={field.color}
                        isSelectable={isSelectable}
                        isSelected={isTeamPlayerSelected}
                        onClick={onClick}
                        onMove={onMove}
                        onDelete={onDelete}
                    />
                );
            })}
        </>
    );
}

TeamPlayersLayer.displayName = 'TeamPlayersLayer';

export default React.memo(TeamPlayersLayer);
