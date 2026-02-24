import { LucideIcon } from 'lucide-react';
import { renderToStaticMarkup } from 'react-dom/server';
import { createElement } from 'react';

interface CursorOptions {
    color: string;
    size: number;
    strokeWidth: number;
    fill: boolean;
}

export function useLucideIconToSvgUrl(
    lucideIcon?: LucideIcon,
    options: CursorOptions = {
        color: '#ff8c00',
        size: 28,
        strokeWidth: 1,
        fill: true,
    }
) {
    const getSvgCursorUrl = (
        iconComponent?: LucideIcon
    ): string | undefined => {
        if (iconComponent === undefined) {
            return 'default';
        }

        const svgString = renderToStaticMarkup(
            createElement(iconComponent, {
                color: options.color,
                size: options.size,
                strokeWidth: options.strokeWidth,
                fill: options.fill ? options.color : 'transparent',
            })
        );

        const encodedSvg =
            typeof window === 'undefined'
                ? Buffer.from(svgString).toString('base64')
                : window.btoa(
                      decodeURIComponent(encodeURIComponent(svgString))
                  );

        return `data:image/svg+xml;base64,${encodedSvg}`;
    };

    const center = options?.size / 2;

    return {
        url: getSvgCursorUrl(lucideIcon),
        center,
    };
}
