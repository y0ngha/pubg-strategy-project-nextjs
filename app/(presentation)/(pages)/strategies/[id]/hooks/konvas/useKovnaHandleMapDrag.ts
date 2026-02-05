import { KonvaEventObject } from 'konva/lib/Node';
import { ORIGINAL_MAP_SIZE } from '@/(presentation)/shared/constants/map';

export function useKovnaHandleMapDrag(
    scale: number,
    stageSize: { width: number; height: number }
) {
    const calculatedScaledMapSize = (originalMapImageSize: number) => {
        const size = originalMapImageSize * scale;

        return {
            width: size,
            height: size,
        };
    };

    const calculatedNewPosition = (
        position: number,
        stageSize: number,
        scaledMapSize: number
    ) => {
        if (scaledMapSize < stageSize) return 0;

        const min = stageSize - scaledMapSize;
        return Math.max(min, Math.min(position, 0));
    };

    const handleDragBound = (pos: { x: number; y: number }) => {
        const { width: stageWidth, height: stageHeight } = stageSize;

        const { width: mapWidth, height: mapHeight } =
            calculatedScaledMapSize(ORIGINAL_MAP_SIZE);

        const x = calculatedNewPosition(pos.x, stageWidth, mapWidth);
        const y = calculatedNewPosition(pos.y, stageHeight, mapHeight);

        return { x, y };
    };

    const handleDragEnd = (event: KonvaEventObject<DragEvent>) => {
        return { x: event.target.x(), y: event.target.y() };
    };

    return {
        handleDragBound,
        handleDragEnd,
    };
}
