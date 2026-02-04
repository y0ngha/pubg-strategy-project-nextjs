import { Circle, Group, Image, Label, Tag, Text } from 'react-konva';
import { useLucideIconToSvgUrl } from '@/(presentation)/(pages)/strategies/[id]/hooks/utils/useLucideIconToSvgUrl';
import useImage from 'use-image';
import { User } from 'lucide-react';
import WaypointProperty from '@/(presentation)/(pages)/strategies/[id]/components/tools/properties/waypoint-property.component';
import MarkerProperty from '@/(presentation)/(pages)/strategies/[id]/components/tools/properties/marker-property.component';
import { StrategyBodyProps } from '@/(presentation)/(pages)/strategies/[id]/components/body/strategy-body.component';
import React from 'react';
import { useKonvaHandleHover } from '@/(presentation)/(pages)/strategies/[id]/hooks/konvas/useKonvaHandleHover';
import { useKonvaHandlePropertyDrag } from '@/(presentation)/(pages)/strategies/[id]/hooks/konvas/useKonvaHandlePropertyDrag';

interface TeamPlayerPropertyProps {
    id: string;
    x: number;
    y: number;
    priority: number;
    color: string;
    isClicked: boolean;
    onClick: (id: string) => void;
    isSelectable: boolean;
    onMove: (
        teamPlayerId: string,
        deltaPosition: { x: number; y: number }
    ) => void;
}

function TeamPlayerProperty({
    id,
    x,
    y,
    priority,
    color,
    isSelectable,
    isClicked,
    onClick,
    onMove,
}: TeamPlayerPropertyProps) {
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

    const { handleDragStart, handleDragEnd } = useKonvaHandlePropertyDrag();

    const { url, center } = useLucideIconToSvgUrl(User, {
        color: iconColor,
        size: 64,
        strokeWidth: 2,
        fill: false,
    });

    const [teamPlayerImage] = useImage(url ?? '');

    const radius = 50;

    const handleClick = () => {
        onClick(id);
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
            onClick={handleClick}
            onMouseEnter={hoverHandleMouseEnter}
            onMouseLeave={hoverHandleMouseLeave}
        >
            <Circle
                x={x}
                y={y}
                radius={isClicked ? radius + 20 : radius}
                fill={`${color}33`}
                stroke={color}
                strokeWidth={isClicked ? 3 : 1}
                dash={isClicked ? [30, 30] : undefined}
                scaleX={isClicked ? 1.2 : scaleX}
                scaleY={isClicked ? 1.2 : scaleY}
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
    );
}

TeamPlayerProperty.displayName = 'TeamPlayerProperty';

function TeamPlayersLayer({
    teamPlayers,
    isSelectable,
    selectedTeamPlayerId,
    changeSelectedTeamPlayerId,
    isWaypointDrawing,
    waypointClickedPositions,
    onMove,
    onMarkerMove,
    onWaypointMove,
}: {
    selectedTeamPlayerId?: string;
    changeSelectedTeamPlayerId: (id: string) => void;
    isWaypointDrawing: boolean;
    waypointClickedPositions: { x: number; y: number }[];
    onMarkerMove: (
        teamPlayerId: string,
        markerId: string,
        deltaPosition: { x: number; y: number }
    ) => void;
    onWaypointMove: (
        teamPlayerId: string,
        waypointId: string,
        deltaPosition: { x: number; y: number }
    ) => void;
} & Pick<TeamPlayerPropertyProps, 'isSelectable' | 'onMove'> &
    Pick<StrategyBodyProps, 'teamPlayers'>) {
    return (
        <>
            {teamPlayers.map(field => {
                return (
                    <React.Fragment key={`tp-${field.priority}`}>
                        <TeamPlayerProperty
                            id={field.id}
                            x={field.position.x}
                            y={field.position.y}
                            priority={field.priority}
                            color={field.color}
                            isSelectable={isSelectable}
                            isClicked={field.id === selectedTeamPlayerId}
                            onClick={id => {
                                changeSelectedTeamPlayerId(id);
                            }}
                            onMove={onMove}
                        />
                        {field.marker && (
                            <MarkerProperty
                                color={field.color}
                                priority={field.priority}
                                x={field.marker.position.x}
                                y={field.marker.position.y}
                                isSelectable={isSelectable}
                                id={field.marker.id}
                                teamPlayerId={field.id}
                                onMove={onMarkerMove}
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
                            id={field.waypoint?.id}
                            teamPlayerId={field.id}
                            onMove={onWaypointMove}
                        />
                    </React.Fragment>
                );
            })}
        </>
    );
}

TeamPlayersLayer.displayName = 'TeamPlayersLayer';

export default React.memo(TeamPlayersLayer);
