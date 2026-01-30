import { LucideIcon } from 'lucide-react';
import { renderToStaticMarkup } from 'react-dom/server';
import { createElement } from 'react';

interface CursorOptions {
    color: string;
    size: number;
    strokeWidth: number;
}

export function useLucideIconToCursorUrl(
    lucideIcon: LucideIcon,
    options: CursorOptions = {
        color: '#ff8c00',
        size: 28,
        strokeWidth: 1,
    }
) {
    const getSvgCursorUrl = (iconComponent: LucideIcon): string | undefined => {
        const svgString = renderToStaticMarkup(
            createElement(iconComponent, {
                color: options.color,
                size: options.size,
                strokeWidth: options.strokeWidth,
                fill: options.color,
            })
        );

        const encodedSvg =
            typeof window === 'undefined'
                ? Buffer.from(svgString).toString('base64')
                : window.btoa(
                      decodeURIComponent(encodeURIComponent(svgString))
                  );

        const center = options?.size / 2;

        return `url('data:image/svg+xml;base64,${encodedSvg}') ${center} ${center}, auto`;
    };

    return {
        url: getSvgCursorUrl(lucideIcon),
    };
}
