import { cva, VariantProps } from 'class-variance-authority';
import { cn } from '@/(presentation)/shared/utils/class-names.util';
import { ReactNode } from 'react';

const BadgeVariants = cva(
    'focus:ring-ring inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:ring-2 focus:ring-offset-2 focus:outline-none',
    {
        variants: {
            variant: {
                primary: 'bg-primary text-white border-transparent',
                secondary:
                    'bg-surface-hover text-foreground border-transparent',
                outline: 'text-foreground border-border',
                danger: 'bg-red-500/10 text-red-500 border-red-500/20',
                success:
                    'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
                warning:
                    'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
            },
        },
        defaultVariants: {
            variant: 'primary',
        },
    }
);

interface BadgeProps extends VariantProps<typeof BadgeVariants> {
    children: ReactNode;
    className?: string;
}

function Badge({ children, className, variant }: BadgeProps) {
    return (
        <span className={cn(BadgeVariants({ variant }), className)}>
            {children}
        </span>
    );
}

Badge.displayName = 'Badge';

export default Badge;
