import { Circle, Group, Image, Label, Layer, Tag, Text } from 'react-konva';
import { useLucideIconToSvgUrl } from '@/(presentation)/(pages)/strategies/[id]/components/hooks/utils/useLucideIconToSvgUrl';
import { Swords } from 'lucide-react';
import useImage from 'use-image';
import { StrategyBodyProps } from '@/(presentation)/(pages)/strategies/[id]/components/strategy-body.compoenent';

interface EnemyTeamPropertyProps {
    x: number;
    y: number;
    teamLabel: string;
}

function EnemyTeamProperty({ x, y, teamLabel }: EnemyTeamPropertyProps) {
    const { url, center } = useLucideIconToSvgUrl(Swords, {
        color: '#ffffff',
        size: 64,
        strokeWidth: 2,
        fill: false,
    });

    const [enemyImage] = useImage(url ?? '');

    const radius = 50;

    return (
        <Group x={x} y={y} listening={false}>
            <Circle
                radius={radius}
                fill={'rgba(239, 68, 68, 0.2)'}
                stroke={'#ef4444'}
                strokeWidth={1}
                shadowColor={'black'}
                shadowBlur={10}
                shadowOpacity={0.3}
            />

            <Image
                image={enemyImage}
                offsetX={center}
                offsetY={center}
                scaleX={0.8}
                scaleY={0.8}
                alt={'적 팀'}
            />

            <Label y={radius + 8}>
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
}: Pick<StrategyBodyProps, 'enemyTeams'>) {
    return (
        <Layer>
            {enemyTeams.map(field => (
                <EnemyTeamProperty
                    key={field.id}
                    x={field.position.x}
                    y={field.position.y}
                    teamLabel={field.teamLabel}
                />
            ))}
        </Layer>
    );
}

EnemyTeamsLayer.displayName = 'EnemyTeamsLayer';

export default EnemyTeamsLayer;
