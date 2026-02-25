import { KonvaEventObject } from 'konva/lib/Node';
import { useKonvaHandleCursorChange } from '@/(presentation)/strategies/hooks/konvas/useKonvaHandleCursorChange';

export function useKonvaHandlePropertyDrag(
    onDragEndEvent?: (deltaPosition: { x: number; y: number }) => void
) {
    const { cursorChange, cursorChangeDispose } =
        useKonvaHandleCursorChange<DragEvent>('grabbing', 'default');

    const handleDragStart = (event: KonvaEventObject<DragEvent>) => {
        event.cancelBubble = true;
        cursorChange(event);
        event.target.moveToTop();
    };

    const handleDragEnd = (event: KonvaEventObject<DragEvent>) => {
        event.cancelBubble = true;
        cursorChangeDispose(event);
        const deltaPosition = getDeltaPosition(event);
        onDragEndEvent?.(deltaPosition);
    };

    const getDeltaPosition = (event: KonvaEventObject<DragEvent>) => {
        const node = event.target;

        const deltaX = node.x();
        const deltaY = node.y();

        node.position({ x: 0, y: 0 });

        return {
            x: deltaX,
            y: deltaY,
        };
    };

    return {
        handleDragStart,
        handleDragEnd,
    };
}
