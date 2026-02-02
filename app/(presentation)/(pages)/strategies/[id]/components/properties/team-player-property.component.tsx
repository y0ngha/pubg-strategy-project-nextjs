import { Circle, Group, Image, Label, Tag, Text } from 'react-konva';
import { useLucideIconToSvgUrl } from '@/(presentation)/(pages)/strategies/[id]/components/hooks/utils/useLucideIconToSvgUrl';
import useImage from 'use-image';
import { User } from 'lucide-react';
import { useKonvaHandleCursorChange } from '@/(presentation)/(pages)/strategies/[id]/components/hooks/konvas/useKonvaHandleCursorChange';

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
    const { handleMouseLeave, handleMouseEnter } = useKonvaHandleCursorChange();
    const { url, center } = useLucideIconToSvgUrl(User, {
        color: '#ffffff',
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
                scaleX={0.8}
                scaleY={0.8}
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

export default TeamPlayerProperty;
