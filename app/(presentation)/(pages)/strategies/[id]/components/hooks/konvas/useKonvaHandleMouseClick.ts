import { KonvaEventObject } from 'konva/lib/Node';

export function useKonvaHandleMouseClick(
    onClick?: (
        event: KonvaEventObject<MouseEvent>,
        clickPosition: { x: number; y: number }
    ) => void
) {
    const handleClick = (event: KonvaEventObject<MouseEvent>) => {
        const mousePosition = event.target
            .getStage()
            ?.getRelativePointerPosition();
        if (!mousePosition) {
            return;
        }

        onClick?.(event, mousePosition);
    };

    return {
        handleClick,
    };
}
