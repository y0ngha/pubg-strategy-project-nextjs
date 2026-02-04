import { Circle, Group, Image, Label, Tag, Text } from 'react-konva';
import { useLucideIconToSvgUrl } from '@/(presentation)/(pages)/strategies/[id]/hooks/utils/useLucideIconToSvgUrl';
import { Swords } from 'lucide-react';
import useImage from 'use-image';
import { StrategyBodyProps } from '@/(presentation)/(pages)/strategies/[id]/components/body/strategy-body.component';
import React from 'react';
import { useKonvaHandleHover } from '@/(presentation)/(pages)/strategies/[id]/hooks/konvas/useKonvaHandleHover';
import { useKonvaHandlePropertyDrag } from '@/(presentation)/(pages)/strategies/[id]/hooks/konvas/useKonvaHandlePropertyDrag';

interface EnemyTeamPropertyProps {
    id: string;
    x: number;
    y: number;
    teamLabel: string;
    isSelectable: boolean;
    onMove: (
        enemyTeamId: string,
        deltaPosition: { x: number; y: number }
    ) => void;
}

function EnemyTeamProperty({
    id,
    x,
    y,
    teamLabel,
    isSelectable,
    onMove,
}: EnemyTeamPropertyProps) {
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

    const { url, center } = useLucideIconToSvgUrl(Swords, {
        color: iconColor,
        size: 64,
        strokeWidth: 2,
        fill: false,
    });

    const [enemyImage] = useImage(url ?? '');

    const radius = 50;

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
            onMouseEnter={hoverHandleMouseEnter}
            onMouseLeave={hoverHandleMouseLeave}
        >
            <Circle
                x={x}
                y={y}
                radius={radius}
                fill={'rgba(239, 68, 68, 0.2)'}
                stroke={'#ef4444'}
                strokeWidth={1}
                scaleX={scaleX}
                scaleY={scaleY}
                shadowBlur={shadowBlur}
                shadowColor={shadowColor}
                shadowOpacity={shadowOpacity}
            />

            <Image
                x={x}
                y={y}
                image={enemyImage}
                offsetX={center}
                offsetY={center}
                scaleX={scaleX}
                scaleY={scaleY}
                shadowBlur={shadowBlur}
                shadowColor={shadowColor}
                shadowOpacity={shadowOpacity}
                alt={'적 팀'}
            />

            <Label x={x} y={y + radius + 8}>
                <Tag
                    fill={'#18181b'}
                    stroke={'#ef4444'}
                    strokeWidth={1}
                    cornerRadius={4}
                    opacity={0.8}
                    pointerDirection={'up'}
                    pointerWidth={10}
                    pointerHeight={5}
                />
                <Text
                    text={teamLabel}
                    fontSize={32}
                    padding={6}
                    fill={'white'}
                    align={'center'}
                />
            </Label>
        </Group>
    );
}

EnemyTeamProperty.displayName = 'EnemyTeamProperty';

function EnemyTeamsLayer({
    enemyTeams,
    isSelectable,
    onMove,
}: Pick<EnemyTeamPropertyProps, 'isSelectable' | 'onMove'> &
    Pick<StrategyBodyProps, 'enemyTeams'>) {
    return (
        <>
            {enemyTeams.map(field => (
                <EnemyTeamProperty
                    key={field.id}
                    id={field.id}
                    x={field.position.x}
                    y={field.position.y}
                    teamLabel={field.teamLabel}
                    isSelectable={isSelectable}
                    onMove={onMove}
                />
            ))}
        </>
    );
}

EnemyTeamsLayer.displayName = 'EnemyTeamsLayer';

export default React.memo(EnemyTeamsLayer);
