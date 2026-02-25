import { KonvaEventObject } from 'konva/lib/Node';
import { useState } from 'react';
import { Property } from 'csstype';

type Cursor = Property.Cursor;

export function useKonvaHandleCursorChange<T extends MouseEvent>(
    changeCursor: Cursor,
    defaultCursor: Cursor = 'default'
) {
    const [previousCursor, setPreviousCursor] = useState<string>(defaultCursor);

    const cursorChange = (event: KonvaEventObject<T>) => {
        const stage = event.target.getStage();
        if (stage) {
            setPreviousCursor(stage.container().style.cursor);
            stage.container().style.cursor = changeCursor;
        }
    };

    const cursorChangeDispose = (event: KonvaEventObject<T>) => {
        const stage = event.target.getStage();
        if (stage) {
            stage.container().style.cursor = previousCursor;
        }
    };

    return { cursorChange, cursorChangeDispose };
}
