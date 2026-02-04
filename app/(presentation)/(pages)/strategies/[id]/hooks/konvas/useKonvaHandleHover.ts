import { useState } from 'react';
import { useKonvaHandleCursorChange } from '@/(presentation)/(pages)/strategies/[id]/hooks/konvas/useKonvaHandleCursorChange';
import { KonvaEventObject } from 'konva/lib/Node';

export function useKonvaHandleHover(baseColor: string) {
    const {
        handleMouseLeave: cursorHandleMouseLeave,
        handleMouseEnter: cursorHandleMouseEnter,
    } = useKonvaHandleCursorChange('pointer', 'default');

    const [isHovered, setIsHovered] = useState<boolean>(false);

    const handleMouseEnter = (event: KonvaEventObject<MouseEvent>) => {
        setIsHovered(true);
        cursorHandleMouseEnter(event);
    };

    const handleMouseLeave = (event: KonvaEventObject<MouseEvent>) => {
        setIsHovered(false);
        cursorHandleMouseLeave(event);
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
