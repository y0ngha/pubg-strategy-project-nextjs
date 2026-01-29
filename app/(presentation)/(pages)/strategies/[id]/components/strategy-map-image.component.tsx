'use client';

import { Image } from 'react-konva';
import useImage from 'use-image';
import StrategyMapImageSkeleton from '@/(presentation)/(pages)/strategies/[id]/components/strategy-map-image-skeleton.component';

interface StrategyMapImageProps {
    src: string;
}

function StrategyMapImage({ src }: StrategyMapImageProps) {
    const [image, status] = useImage(src);
    const originalMapSize = 8192;

    if (status === 'loading') {
        return <StrategyMapImageSkeleton text={'맵 데이터를 불러오는 중...'} />;
    }

    return (
        <Image
            image={image}
            width={originalMapSize}
            height={originalMapSize}
            listening={false}
            alt={'배틀그라운드 맵 이미지'}
        />
    );
}

StrategyMapImage.displayName = 'StrategyMapImage';

export default StrategyMapImage;
