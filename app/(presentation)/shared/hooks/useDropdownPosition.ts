import {
    RefObject,
    useEffect,
    useEffectEvent,
    useLayoutEffect,
    useState,
} from 'react';

interface Position {
    top: number;
    left: number;
}

export function useDropdownPosition(
    dropdownRef: RefObject<HTMLDivElement | null>,
    triggerRef: RefObject<HTMLElement | null>,
    open: boolean,
    align: 'start' | 'center' | 'end' = 'end'
) {
    const [position, setPosition] = useState<Position | null>(null);

    const getLeftMapByAlign = (rect: DOMRect, containerWidth: number) => {
        return {
            start: rect.left,
            center: rect.left + rect.width / 2 - containerWidth / 2,
            end: rect.right - containerWidth,
        };
    };

    const isOverViewportHeight = (top: number, containerHeight: number) => {
        const viewportHeight = window.innerHeight;

        return top + containerHeight > viewportHeight;
    };

    const isLeftCutOffInViewport = (left: number) => {
        return left < 0;
    };

    const isRightCutOffInViewPort = (
        left: number,
        containerWidth: number,
        viewportWidth: number
    ) => {
        return left + containerWidth > viewportWidth;
    };

    const adjustTopPosition = (top: number, containerHeight: number) => {
        if (isOverViewportHeight(top, containerHeight)) {
            return top - containerHeight;
        }

        return top;
    };

    const adjustLeftPosition = (left: number, containerWidth: number) => {
        const viewportWidth = window.innerWidth;
        const padding = 8;

        let adjustedLeft = left;

        if (isLeftCutOffInViewport(adjustedLeft)) {
            adjustedLeft = padding;
        } else if (
            isRightCutOffInViewPort(adjustedLeft, containerWidth, viewportWidth)
        ) {
            adjustedLeft = viewportWidth - containerWidth - padding;
        }

        return adjustedLeft;
    };

    const updatePosition = useEffectEvent(() => {
        const trigger = triggerRef.current;
        const dropdown = dropdownRef.current;
        if (!trigger || !dropdown) return;

        const rect = trigger.getBoundingClientRect();
        const dropdownHeight = dropdown.offsetHeight ?? 0;
        const dropdownWidth = dropdown.offsetWidth ?? 0;

        const top = adjustTopPosition(rect.bottom, dropdownHeight);
        const left = adjustLeftPosition(
            getLeftMapByAlign(rect, dropdownWidth)[align],
            dropdownWidth
        );

        setPosition({
            top,
            left,
        });
    });

    useLayoutEffect(() => {
        if (open) {
            updatePosition();
        }
    }, [open]);

    useEffect(() => {
        if (!open) return;

        window.addEventListener('scroll', updatePosition, true);
        window.addEventListener('resize', updatePosition);

        return () => {
            window.removeEventListener('scroll', updatePosition, true);
            window.removeEventListener('resize', updatePosition);
        };
    }, [open]);

    return position;
}
