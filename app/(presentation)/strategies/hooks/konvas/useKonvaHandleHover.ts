import { useState } from 'react';
import { useKonvaHandleCursorChange } from '@/(presentation)/strategies/hooks/konvas/useKonvaHandleCursorChange';
import { KonvaEventObject } from 'konva/lib/Node';

export function useKonvaHandleHover(baseColor: string) {
    const { cursorChange, cursorChangeDispose } =
        useKonvaHandleCursorChange<MouseEvent>('pointer', 'default');

    const [isHovered, setIsHovered] = useState<boolean>(false);

    const handleMouseEnter = (event: KonvaEventObject<MouseEvent>) => {
        setIsHovered(true);
        cursorChange(event);
    };

    const handleMouseLeave = (event: KonvaEventObject<MouseEvent>) => {
        setIsHovered(false);
        cursorChangeDispose(event);
    };

    const scaleX = isHovered ? 1.2 : 1;
    const scaleY = isHovered ? 1.2 : 1;
    const shadowBlur = isHovered ? 15 : 0;
    const shadowColor = baseColor;
    const shadowOpacity = 0.8;

    return {
        isHovered,
        handleMouseEnter,
        handleMouseLeave,
        scaleX,
        scaleY,
        shadowBlur,
        shadowColor,
        shadowOpacity,
    };
}
