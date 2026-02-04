import { useState } from 'react';

export function useKonvaHandleHover() {
    const [isHovered, setIsHovered] = useState<boolean>(false);

    const handleMouseEnter = () => {
        setIsHovered(true);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
    };

    return { isHovered, handleMouseEnter, handleMouseLeave };
}
