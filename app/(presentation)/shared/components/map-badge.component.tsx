import { cva, VariantProps } from 'class-variance-authority';
import { cn } from '@/(presentation)/shared/utils/class-names.util';
import { HTMLAttributes } from 'react';

const MapStyles = {
    에란겔: 'bg-emerald-900/50 text-emerald-400 border-emerald-800',
    미라마: 'bg-amber-900/50 text-amber-400 border-amber-800',
    사녹: 'bg-lime-900/50 text-lime-400 border-lime-800',
    테이고: 'bg-sky-900/50 text-sky-400 border-sky-800',
    비켄디: 'bg-slate-800/50 text-slate-300 border-slate-600',
    론도: 'bg-zinc-800 text-zinc-400 border-zinc-700',
    카라킨: 'bg-zinc-800 text-zinc-400 border-zinc-700',
    헤이븐: 'bg-zinc-800 text-zinc-400 border-zinc-700',
    데스턴: 'bg-zinc-800 text-zinc-400 border-zinc-700',
    default: 'bg-zinc-800 text-zinc-400 border-zinc-700',
} as const;

type Map = keyof typeof MapStyles;

const MapBadgeVariants = cva(
    'rounded border px-2 py-0.5 font-bold tracking-wider uppercase',
    {
        variants: {
            map: MapStyles,
        },
        defaultVariants: {
            map: 'default',
        },
    }
);

interface MapBadgeProps extends HTMLAttributes<HTMLSpanElement> {
    map: string;
}

function MapBadge({ map, children, className, ...props }: MapBadgeProps) {
    const safeMap: VariantProps<typeof MapBadgeVariants>['map'] =
        isMapInMapStyles(map) ? map : 'default';

    return (
        <span
            className={cn(MapBadgeVariants({ map: safeMap }), className)}
            {...props}
        >
            {children}
        </span>
    );
}

function isMapInMapStyles(map: string): map is Map {
    return Object.keys(MapStyles).includes(map);
}

MapBadge.displayName = 'MapBadge';

export default MapBadge;
