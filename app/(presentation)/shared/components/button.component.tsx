import { cva, VariantProps } from 'class-variance-authority';
import { cn } from '@/(presentation)/shared/utils/class-names.util';

const ButtonVariants = cva(
    'cursor-pointer inline-flex items-center justify-center rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:pointer-events-none disabled:opacity-50',
    {
        variants: {
            variant: {
                primary:
                    'bg-primary text-white shadow-lg shadow-orange/20 hover:bg-primary/90',
                secondary:
                    'bg-surface text-foreground border border-border hover:bg-surface/80',
                outline:
                    'border border-primary text-primary hover:bg-primary hover:text-white',
                ghost: 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
                danger: 'bg-red-600 text-white hover:bg-red-700',
            },
            size: {
                sm: 'h-8 px-3 text-xs',
                md: 'h-10 px-4 text-sm',
                lg: 'h-12 px-6 text-base',
            },
        },
        defaultVariants: {
            variant: 'primary',
            size: 'md',
        },
    }
);

interface ButtonProps
    extends
        React.ButtonHTMLAttributes<HTMLButtonElement>,
        VariantProps<typeof ButtonVariants> {}

function Button({ className, children, variant, size, ...props }: ButtonProps) {
    return (
        <button
            className={cn(ButtonVariants({ variant, size, className }))}
            {...props}
        >
            {children}
        </button>
    );
}

Button.displayName = 'Button';

export default Button;
