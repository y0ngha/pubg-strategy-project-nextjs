import { KonvaEventObject } from 'konva/lib/Node';
import { useState } from 'react';

export function useKonvaHandleMouseClick(
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
        const mousePosition = event.target
            .getStage()
            ?.getRelativePointerPosition();
        if (!mousePosition) {
            return;
        }

        setMapClickPosition(mousePosition);
        onClick?.(event, mousePosition);
    };

    return {
        handleClick,
        mapClickPosition,
    };
}
