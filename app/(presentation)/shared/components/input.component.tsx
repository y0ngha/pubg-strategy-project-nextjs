import { cva, VariantProps } from 'class-variance-authority';
import { cn } from '@/(presentation)/shared/utils/class-names.util';

const InputVariants = cva(
    'flex h-11 w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50',
    {
        variants: {
            size: {
                normal: 'h-11 px-3 py-2',
                sm: 'h-9 px-3',
                lg: 'h-12 px-4 text-base',
            },
        },
        defaultVariants: {
            size: 'normal',
        },
    }
);

interface InputProps
    extends
        Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
        VariantProps<typeof InputVariants> {
    label?: string;
    error?: string;
    ref?: React.Ref<HTMLInputElement>;
}

function Input({
    className,
    type,
    label,
    error,
    size,
    ref,
    disabled,
    ...props
}: InputProps) {
    return (
        <div className="w-full space-y-1">
            {label && (
                <label className="text-muted-foreground text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    {label}
                </label>
            )}
            <input
                type={type}
                className={cn(
                    InputVariants({ size }),
                    error && 'border-red-500 focus-visible:ring-red-500',
                    className
                )}
                ref={ref}
                {...props}
            />
            {error && (
                <p className="text-xs font-medium text-red-500">{error}</p>
            )}
        </div>
    );
}

Input.displayName = 'Input';

export default Input;
