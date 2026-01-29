'use client';

import { Image } from 'react-konva';
import useImage from 'use-image';

interface StrategyMapImageProps {
    src: string;
}

function StrategyMapImage({ src }: StrategyMapImageProps) {
    const [image] = useImage(src);

    return (
        <Image
            image={image}
            width={8192}
            height={8192}
            listening={false}
            alt={'배틀그라운드 맵 이미지'}
        />
    );
}

StrategyMapImage.displayName = 'StrategyMapImage';

export default StrategyMapImage;
