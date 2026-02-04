'use client';

import { Group, Rect, Text } from 'react-konva';

interface StrategyMapImageSkeletonProps {
    text: string;
}

function StrategyMapImageSkeleton({ text }: StrategyMapImageSkeletonProps) {
    return (
        <Group>
            <Rect fill={'#18181b'} />
            <Text
                x={200}
                y={200}
                text={text}
                fontSize={128}
                fill={'#ffffff'}
                align={'top'}
            />
        </Group>
    );
}

StrategyMapImageSkeleton.displayName = 'StrategyMapImageSkeleton';

export default StrategyMapImageSkeleton;
