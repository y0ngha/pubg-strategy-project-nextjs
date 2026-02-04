import { Circle, Group, Image, Label, Layer, Tag, Text } from 'react-konva';
import { useLucideIconToSvgUrl } from '@/(presentation)/(pages)/strategies/[id]/hooks/utils/useLucideIconToSvgUrl';
import useImage from 'use-image';
import { User } from 'lucide-react';
import { useKonvaHandleCursorChange } from '@/(presentation)/(pages)/strategies/[id]/hooks/konvas/useKonvaHandleCursorChange';
import WaypointProperty from '@/(presentation)/(pages)/strategies/[id]/components/tools/properties/waypoint-property.component';
import MarkerProperty from '@/(presentation)/(pages)/strategies/[id]/components/tools/properties/marker-property.component';
import { StrategyBodyProps } from '@/(presentation)/(pages)/strategies/[id]/components/body/strategy-body.component';
import React from 'react';
import { useKonvaHandleHover } from '@/(presentation)/(pages)/strategies/[id]/hooks/konvas/useKonvaHandleHover';
import { KonvaEventObject } from 'konva/lib/Node';

interface TeamPlayerPropertyProps {
    id: string;
    x: number;
    y: number;
    priority: number;
    color: string;
    clickable: boolean;
    isClicked: boolean;
    onClick: (id: string) => void;
}

function TeamPlayerProperty({
    id,
    x,
    y,
    priority,
    color,
    clickable,
    isClicked,
    onClick,
}: TeamPlayerPropertyProps) {
    const {
        handleMouseLeave: cursorHandleMouseLeave,
        handleMouseEnter: cursorHandleMouseEnter,
    } = useKonvaHandleCursorChange('pointer');

    const {
        isHovered,
        handleMouseLeave: hoverHandleMouseLeave,
        handleMouseEnter: hoverHandleMouseEnter,
    } = useKonvaHandleHover();

    const iconColor = '#ffffff';

    const { url, center } = useLucideIconToSvgUrl(User, {
        color: iconColor,
        size: 64,
        strokeWidth: 2,
        fill: false,
    });

    const [teamPlayerImage] = useImage(url ?? '');

    const radius = 50;

    const handleMouseEnter = (event: KonvaEventObject<MouseEvent>) => {
        hoverHandleMouseEnter();
        cursorHandleMouseEnter(event);
    };

    const handleMouseLeave = (event: KonvaEventObject<MouseEvent>) => {
        hoverHandleMouseLeave();
        cursorHandleMouseLeave(event);
    };

    const handleClick = () => {
        onClick(id);
    };

    return (
        <Group
            x={x}
            y={y}
            listening={clickable}
            onClick={handleClick}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <Circle
                radius={radius}
                fill={isClicked ? '#00000033' : `${color}33`}
                stroke={isClicked ? '#000000' : color}
                strokeWidth={1}
                shadowColor={'black'}
                shadowBlur={10}
                shadowOpacity={0.3}
                dash={isClicked ? [30, 30] : undefined}
            />

            <Image
                image={teamPlayerImage}
                offsetX={center}
                offsetY={center}
                scaleX={isHovered ? 1.0 : 0.8}
                scaleY={isHovered ? 1.0 : 0.8}
                shadowColor={iconColor}
                shadowBlur={isHovered ? 15 : 0}
                alt={`팀 플레이어 - ${priority}`}
            />

            <Label y={radius + 8}>
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
    clickable,
    selectedTeamPlayerId,
    changeSelectedTeamPlayerId,
    isWaypointDrawing,
    waypointClickedPositions,
}: {
    clickable: boolean;
    selectedTeamPlayerId?: string;
    changeSelectedTeamPlayerId: (id: string) => void;
    isWaypointDrawing: boolean;
    waypointClickedPositions: { x: number; y: number }[];
} & Pick<StrategyBodyProps, 'teamPlayers'>) {
    return (
        <Layer>
            {teamPlayers.map(field => {
                return (
                    <React.Fragment key={`tp-${field.priority}`}>
                        <TeamPlayerProperty
                            id={field.id}
                            x={field.position.x}
                            y={field.position.y}
                            priority={field.priority}
                            color={field.color}
                            clickable={clickable}
                            isClicked={field.id === selectedTeamPlayerId}
                            onClick={id => {
                                changeSelectedTeamPlayerId(id);
                            }}
                        />
                        {field.marker && (
                            <MarkerProperty
                                color={field.color}
                                priority={field.priority}
                                x={field.marker.position.x}
                                y={field.marker.position.y}
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
                        />
                    </React.Fragment>
                );
            })}
        </Layer>
    );
}

TeamPlayersLayer.displayName = 'TeamPlayersLayer';

export default React.memo(TeamPlayersLayer);
