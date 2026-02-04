import { KonvaEventObject } from 'konva/lib/Node';
import { useState } from 'react';
import { Property } from 'csstype';

type Cursor = Property.Cursor;

export function useKonvaHandleCursorChange(
    changeCursor: Cursor,
    defaultCursor: Cursor = 'default'
) {
    const [previousCursor, setPreviousCursor] = useState<string>(defaultCursor);

    const handleMouseEnter = (e: KonvaEventObject<MouseEvent>) => {
        const stage = e.target.getStage();
        if (stage) {
            setPreviousCursor(stage.container().style.cursor);
            stage.container().style.cursor = changeCursor;
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
