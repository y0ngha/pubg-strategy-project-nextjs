import { Circle, Group, Image, Label, Tag, Text } from 'react-konva';
import { useLucideIconToSvgUrl } from '@/(presentation)/(pages)/strategies/[id]/components/hooks/utils/useLucideIconToSvgUrl';
import useImage from 'use-image';
import { User } from 'lucide-react';

interface TeamPlayerPropertyProps {
    x: number;
    y: number;
    priorty: number;
    color: string;
    scale: number;
}

function TeamPlayerProperty({
    x,
    y,
    priorty,
    color,
    scale,
}: TeamPlayerPropertyProps) {
    const { url, center } = useLucideIconToSvgUrl(User, {
        color: '#ffffff',
        size: 64,
        strokeWidth: 2,
    });

    const [teamPlayerImage] = useImage(url ?? '');

    const radius = 50;

    return (
        <Group x={x} y={y} listening={false}>
            <Circle
                radius={radius}
                fill={`${color}33`}
                stroke={color}
                strokeWidth={1}
                shadowColor={'black'}
                shadowBlur={10}
                shadowOpacity={0.3}
            />

            <Image
                image={teamPlayerImage}
                offsetX={center}
                offsetY={center}
                scaleX={0.8}
                scaleY={0.8}
                alt={`팀 플레이어 - ${priorty}`}
            />

            <Label y={radius + 8}>
                <Tag
                    fill={'#18181b'}
                    stroke={color}
                    strokeWidth={1 / scale}
                    cornerRadius={4}
                    opacity={0.8}
                    pointerDirection={'up'}
                    pointerWidth={10}
                    pointerHeight={5}
                />
                <Text
                    text={priorty.toString()}
                    fontSize={12 / scale}
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
