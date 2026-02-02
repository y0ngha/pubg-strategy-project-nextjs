import { KonvaEventObject } from 'konva/lib/Node';
import { useState } from 'react';

export function useKonvaHandleCursorChange() {
    const [previousCursor, setPreviousCursor] = useState<string>('default');

    const handleMouseEnter = (e: KonvaEventObject<MouseEvent>) => {
        const stage = e.target.getStage();
        if (stage) {
            setPreviousCursor(stage.container().style.cursor);
            stage.container().style.cursor = 'pointer';
        }
    };

    const handleMouseLeave = (e: KonvaEventObject<MouseEvent>) => {
        const stage = e.target.getStage();
        if (stage) {
            stage.container().style.cursor = previousCursor;
        }
    };

    return { handleMouseEnter, handleMouseLeave };
}
