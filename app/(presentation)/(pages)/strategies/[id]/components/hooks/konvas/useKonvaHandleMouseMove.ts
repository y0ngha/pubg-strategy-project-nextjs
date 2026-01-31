import { useRef, useState } from 'react';
import Konva from 'konva';

export function useKonvaHandleMouseMove() {
    const stageRef = useRef<Konva.Stage>(null);

    const [mousePosition, setMousePosition] = useState<{
        x: number;
        y: number;
    }>({ x: 0, y: 0 });

    const roundToTwoDecimalPlaces = (number: number): number => {
        return Math.round(number * 100) / 100;
    };

    const handleMouseMove = () => {
        const { x, y } = stageRef.current?.getRelativePointerPosition() ?? {
            x: 0,
            y: 0,
        };

        setMousePosition({
            x: x < 0 ? 0 : roundToTwoDecimalPlaces(x),
            y: y < 0 ? 0 : roundToTwoDecimalPlaces(y),
        });
    };

    return {
        stageRef,
        mousePosition,
        handleMouseMove,
    };
}
