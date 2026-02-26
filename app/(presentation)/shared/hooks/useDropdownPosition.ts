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
    placement: 'bottom' | 'top';
    direction: 'right' | 'left';
}

export function useDropdownPosition(
    dropdownRef: RefObject<HTMLDivElement | null>,
    triggerRef: RefObject<HTMLElement | null>,
    open: boolean
) {
    const [position, setPosition] = useState<Position | null>(null);

    const updatePosition = useEffectEvent(() => {
        const trigger = triggerRef.current;
        const dropdown = dropdownRef.current;
        if (!trigger || !dropdown) return;

        const rect = trigger.getBoundingClientRect();
        const dropdownHeight = dropdown.offsetHeight ?? 0;
        const dropdownWidth = dropdown.offsetWidth ?? 0;
        const viewportHeight = window.innerHeight;
        const viewportWidth = window.innerWidth;

        let top = rect.bottom;
        let left = rect.right;
        let placement: 'bottom' | 'top' = 'bottom';
        let direction: 'left' | 'right' = 'right';

        if (rect.bottom + dropdownHeight > viewportHeight) {
            top = rect.top - dropdownHeight;
            placement = 'top';
        }

        if (rect.left + dropdownWidth > viewportWidth) {
            left = rect.right - dropdownWidth;
            direction = 'left';
        }

        setPosition({
            top,
            left,
            placement,
            direction,
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
