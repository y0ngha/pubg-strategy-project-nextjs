import { cva, VariantProps } from 'class-variance-authority';
import { cn } from '@/(presentation)/shared/utils/class-names.util';
import { HTMLAttributes } from 'react';

const MapBadgeVariants = cva(
    'rounded border px-2 py-0.5 font-bold tracking-wider uppercase',
    {
        variants: {
            map: {
                erangel:
                    'bg-emerald-900/50 text-emerald-400 border-emerald-800',
                miramar: 'bg-amber-900/50 text-amber-400 border-amber-800',
                sanhok: 'bg-lime-900/50 text-lime-400 border-lime-800',
                taego: 'bg-sky-900/50 text-sky-400 border-sky-800',
                vikendi: 'bg-slate-800/50 text-slate-300 border-slate-600',
                rondo: 'bg-zinc-800 text-zinc-400 border-zinc-700',
                karakin: 'bg-zinc-800 text-zinc-400 border-zinc-700',
                haven: 'bg-zinc-800 text-zinc-400 border-zinc-700',
                deston: 'bg-zinc-800 text-zinc-400 border-zinc-700',
            },
        },
    }
);

interface MapBadgeProps
    extends
        HTMLAttributes<HTMLSpanElement>,
        VariantProps<typeof MapBadgeVariants> {}

function MapBadge({ map, children, className, ...props }: MapBadgeProps) {
    return (
        <span className={cn(MapBadgeVariants({ map }), className)} {...props}>
            {children}
        </span>
    );
}

MapBadge.displayName = 'MapBadge';

export default MapBadge;
