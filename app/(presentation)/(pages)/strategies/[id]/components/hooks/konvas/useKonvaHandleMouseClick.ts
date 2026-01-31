import { KonvaEventObject } from 'konva/lib/Node';
import { useState } from 'react';

export function useKonvaHandleMouseClick(
    mousePosition: { x: number; y: number },
    onClick?: (
        event: KonvaEventObject<MouseEvent>,
        clickPosition: { x: number; y: number }
    ) => void
) {
    const [mapClickPosition, setMapClickPosition] = useState<{
        x: number;
        y: number;
    }>({ x: 0, y: 0 });

    const handleClick = (event: KonvaEventObject<MouseEvent>) => {
        setMapClickPosition(mousePosition);
        onClick?.(event, mousePosition);
    };

    return {
        handleClick,
        mapClickPosition,
    };
}
