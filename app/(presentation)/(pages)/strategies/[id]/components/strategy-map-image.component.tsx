'use client';

import { Image } from 'react-konva';
import useImage from 'use-image';

interface StrategyMapImageProps {
    src: string;
}

function StrategyMapImage({ src }: StrategyMapImageProps) {
    const [image] = useImage(src);

    return (
        <Image image={image} listening={false} alt={'배틀그라운드 맵 이미지'} />
    );
}

StrategyMapImage.displayName = 'StrategyMapImage';

export default StrategyMapImage;
