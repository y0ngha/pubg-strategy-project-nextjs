'use client';

import { Image } from 'react-konva';
import useImage from 'use-image';
import StrategyMapImageSkeleton from '@/(presentation)/strategies/components/[id]/body/map/strategy-map-image-skeleton.component';
import { ORIGINAL_MAP_SIZE } from '@/(presentation)/shared/constants/map';

interface StrategyMapImageProps {
    src: string;
}

function StrategyMapImage({ src }: StrategyMapImageProps) {
    const [image, status] = useImage(src);

    if (status === 'loading') {
        return <StrategyMapImageSkeleton text={'맵 데이터를 불러오는 중...'} />;
    }

    return (
        <Image
            image={image}
            width={ORIGINAL_MAP_SIZE}
            height={ORIGINAL_MAP_SIZE}
            listening={false}
            alt={'배틀그라운드 맵 이미지'}
        />
    );
}

StrategyMapImage.displayName = 'StrategyMapImage';

export default StrategyMapImage;
