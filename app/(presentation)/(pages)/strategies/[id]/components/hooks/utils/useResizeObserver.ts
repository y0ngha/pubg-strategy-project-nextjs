import { RefObject, useEffect, useState } from 'react';

export function useResizeObserver<T extends HTMLElement>(
    ref: RefObject<T | null>
) {
    const [size, setSize] = useState({ width: 0, height: 0 });

    useEffect(() => {
        const container = ref.current;
        if (!container) return;

        const resizeObserver = new ResizeObserver(entries => {
            for (const entry of entries) {
                const { width, height } = entry.target.getBoundingClientRect();

                setSize({ width, height });
            }
        });

        resizeObserver.observe(container);

        return () => resizeObserver.disconnect();
    }, []);

    return {
        width: size.width,
        height: size.height,
    };
}
