'use client';

import { Circle, Group, Image, Label, Tag, Text } from 'react-konva';
import { useLucideIconToSvgUrl } from '@/(presentation)/(pages)/strategies/[id]/hooks/utils/useLucideIconToSvgUrl';
import useImage from 'use-image';
import { User } from 'lucide-react';
import WaypointProperty from '@/(presentation)/(pages)/strategies/[id]/components/tools/properties/waypoint-property.component';
import MarkerProperty from '@/(presentation)/(pages)/strategies/[id]/components/tools/properties/marker-property.component';
import { StrategyBodyProps } from '@/(presentation)/(pages)/strategies/[id]/components/body/strategy-body.component';
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
    onClick: (id: string) => void;
    isSelectable: boolean;
    onMove: (
        teamPlayerId: string,
        deltaPosition: { x: number; y: number }
    ) => void;
    onDelete: (teamPlayerId: string) => void;
}

interface WaypointPropertyProps {
    isWaypointDrawing: boolean;
    waypointClickedPositions: { x: number; y: number }[];
    selectedWaypointId?: { teamPlayerId: string; id: string };
    onWaypointClick: (data?: { teamPlayerId: string; id: string }) => void;
    onWaypointMove: (
        teamPlayerId: string,
        waypointId: string,
        deltaPosition: { x: number; y: number }
    ) => void;
    onWaypointDelete: (teamPlayerId: string, waypointId: string) => void;
}

interface MarkerPropertyProps {
    selectedMarkerId?: { teamPlayerId: string; id: string };
    onMarkerClick: (data?: { teamPlayerId: string; id: string }) => void;
    onMarkerMove: (
        teamPlayerId: string,
        markerId: string,
        deltaPosition: { x: number; y: number }
    ) => void;
    onMarkerDelete: (teamPlayerId: string, markerId: string) => void;
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
        onClick(id);
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
    selectedWaypointId,
    selectedMarkerId,
    onClick,
    isWaypointDrawing,
    waypointClickedPositions,
    onMove,
    onMarkerMove,
    onWaypointMove,
    onDelete,
    onMarkerDelete,
    onWaypointDelete,
    onMarkerClick,
    onWaypointClick,
}: { selectedTeamPlayerId?: string } & Pick<
    TeamPlayerPropertyProps,
    'isSelectable' | 'onMove' | 'onDelete' | 'onClick'
> &
    Pick<StrategyBodyProps, 'teamPlayers'> &
    WaypointPropertyProps &
    MarkerPropertyProps) {
    return (
        <>
            {teamPlayers.map(field => {
                const isTeamPlayerSelected = selectedTeamPlayerId === field.id;

                const isMarkerSelected =
                    selectedMarkerId?.teamPlayerId === field.id &&
                    selectedMarkerId.id === field.marker?.id;

                const isWaypointSelected =
                    selectedWaypointId?.teamPlayerId === field.id &&
                    selectedWaypointId.id === field.waypoint?.id;

                return (
                    <React.Fragment key={`tp-${field.priority}`}>
                        <TeamPlayerProperty
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
                        {field.marker && (
                            <MarkerProperty
                                color={field.color}
                                priority={field.priority}
                                x={field.marker.position.x}
                                y={field.marker.position.y}
                                isSelectable={isSelectable}
                                isSelected={isMarkerSelected}
                                id={field.marker.id}
                                teamPlayerId={field.id}
                                onMove={onMarkerMove}
                                onDelete={onMarkerDelete}
                                onClick={onMarkerClick}
                            />
                        )}
                        <WaypointProperty
                            positions={
                                isWaypointDrawing &&
                                selectedTeamPlayerId === field.id
                                    ? waypointClickedPositions
                                    : (field.waypoint?.positions ?? [])
                            }
                            color={field.color}
                            priority={field.priority}
                            isDrawing={isWaypointDrawing}
                            isSelectable={isSelectable}
                            isSelected={isWaypointSelected}
                            id={field.waypoint?.id}
                            teamPlayerId={field.id}
                            onMove={onWaypointMove}
                            onDelete={onWaypointDelete}
                            onClick={onWaypointClick}
                        />
                    </React.Fragment>
                );
            })}
        </>
    );
}

TeamPlayersLayer.displayName = 'TeamPlayersLayer';

export default React.memo(TeamPlayersLayer);
