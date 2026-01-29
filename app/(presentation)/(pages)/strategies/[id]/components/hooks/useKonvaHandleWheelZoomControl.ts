import { KonvaEventObject } from 'konva/lib/Node';
import { useState } from 'react';

export function useKonvaHandleWheelZoomControl() {
    const [scale, setScale] = useState<number>(0.2);

    const calculateMousePoint = (
        pointerPosition: number,
        stagePosition: number,
        oldScale: number
    ) => {
        return pointerPosition / oldScale - stagePosition / oldScale;
    };

    const calculateScale = (deltaY: number, oldScale: number) => {
        const scaleBy = 1.1;

        const newScale = deltaY > 0 ? oldScale / scaleBy : oldScale * scaleBy;
        if (newScale < 0.2) {
            return 0.2;
        }

        return newScale;
    };

    const calculateStagePosition = (
        mousePointPosition: number,
        pointerPosition: number,
        newScale: number
    ) => {
        return -(mousePointPosition - pointerPosition / newScale) * newScale;
    };

    const handleWheel = (e: KonvaEventObject<WheelEvent>) => {
        e.evt.preventDefault();
        const stage = e.target.getStage();
        const pointerPosition = stage?.getPointerPosition();
        if (stage && pointerPosition) {
            const oldScale = stage.scaleX();

            const mousePointTo = {
                x: calculateMousePoint(pointerPosition.x, stage.x(), oldScale),
                y: calculateMousePoint(pointerPosition.y, stage.y(), oldScale),
            };

            const newScale = calculateScale(e.evt.deltaY, oldScale);

            setScale(newScale);

            return {
                x: calculateStagePosition(
                    mousePointTo.x,
                    pointerPosition.x,
                    newScale
                ),
                y: calculateStagePosition(
                    mousePointTo.y,
                    pointerPosition.y,
                    newScale
                ),
            };
        }

        return {
            x: 0,
            y: 0,
        };
    };

    return {
        handleWheel,
        scale,
    };
}
