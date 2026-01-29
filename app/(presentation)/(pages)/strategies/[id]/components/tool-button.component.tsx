'use client';

import { HTMLAttributes, ReactNode } from 'react';
import { cva, VariantProps } from 'class-variance-authority';
import { cn } from '@/(presentation)/shared/utils/class-names.util';

const ToolButtonVariants = cva(
    'group relative flex h-10 w-10 items-center justify-center rounded-lg border transition-all',
    {
        variants: {
            active: {
                true: 'border-orange-500 bg-orange-500/10 text-orange-500',
                false: 'border-transparent bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-zinc-100 cursor-pointer',
            },
        },
        defaultVariants: {
            active: false,
        },
    }
);

interface ToolButtonProps
    extends
        HTMLAttributes<HTMLButtonElement>,
        VariantProps<typeof ToolButtonVariants> {
    icon: ReactNode;
    tooltip: string;
    active: boolean;
}

function ToolButton({
    icon,
    tooltip,
    active,
    className,
    ...props
}: ToolButtonProps) {
    return (
        <button
            type={'button'}
            className={cn(ToolButtonVariants({ active }), className)}
            {...props}
        >
            {icon}

            {!active && (
                <span
                    className={`pointer-events-none absolute top-full left-1/2 z-50 mt-2 -translate-x-1/2 -translate-y-2.5 rounded bg-black/90 px-2.5 py-1.5 text-xs font-medium whitespace-nowrap text-white opacity-0 shadow-lg backdrop-blur-sm transition-all duration-200 ease-in-out group-hover:translate-y-0 group-hover:opacity-100`}
                >
                    {tooltip}
                    <span
                        className={`absolute bottom-full left-1/2 -ml-1.25 h-0 w-0 border-[5px] border-transparent border-b-black/90`}
                    />
                </span>
            )}
        </button>
    );
}

ToolButton.displayName = 'ToolButton';

export default ToolButton;
