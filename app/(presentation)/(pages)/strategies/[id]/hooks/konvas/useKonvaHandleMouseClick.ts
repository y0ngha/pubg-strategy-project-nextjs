import { KonvaEventObject } from 'konva/lib/Node';

export function useKonvaHandleMouseClick(
    onClick?: (
        event: KonvaEventObject<MouseEvent>,
        clickPosition: { x: number; y: number },
        windowPosition: { x: number; y: number }
    ) => void
) {
    const handleClick = (event: KonvaEventObject<MouseEvent>) => {
        event.cancelBubble = true;

        const mousePosition = event.target
            .getStage()
            ?.getRelativePointerPosition();

        if (!mousePosition) {
            return;
        }

        const windowPosition = { x: event.evt.clientX, y: event.evt.clientY };

        onClick?.(event, mousePosition, windowPosition);
    };

    return {
        handleClick,
    };
}
