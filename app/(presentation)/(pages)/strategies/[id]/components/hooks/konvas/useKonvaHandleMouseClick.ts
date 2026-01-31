import { KonvaEventObject } from 'konva/lib/Node';

export function useKonvaHandleMouseClick(
    mousePosition: { x: number; y: number },
    onClick?: (
        event: KonvaEventObject<MouseEvent>,
        clickPosition: { x: number; y: number }
    ) => void
) {
    const handleClick = (event: KonvaEventObject<MouseEvent>) => {
        onClick?.(event, mousePosition);
    };

    return {
        handleClick,
    };
}
