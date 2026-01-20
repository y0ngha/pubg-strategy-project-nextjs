import { cva, VariantProps } from 'class-variance-authority';
import { useId } from 'react';
import { cn } from '@/(presentation)/shared/utils/class-names.util';
import { ChevronDown } from 'lucide-react';

const SelectVariants = cva(
    'w-full h-10 appearance-none rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 pr-8',
    {
        variants: {
            size: {
                normal: 'h-11 px-3 py-2',
                sm: 'h-9 px-3',
                lg: 'h-12 px-4',
            },
        },
        defaultVariants: {
            size: 'normal',
        },
    }
);

interface SelectProps
    extends
        Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'>,
        VariantProps<typeof SelectVariants> {
    label?: string;
    error?: string;
    options: { label: string; value: string | number }[];
}

function Select({
    label,
    error,
    options,
    size,
    className,
    disabled,
    ...props
}: SelectProps) {
    const id = useId();

    return (
        <div className={'w-full space-y-1'}>
            {label && (
                <label
                    htmlFor={id}
                    className={cn(
                        'text-muted-foreground text-sm leading-none font-medium',
                        disabled && 'cursor-not-allowed opacity-70'
                    )}
                >
                    {label}
                </label>
            )}
            <div className={'relative'}>
                <select
                    disabled={disabled}
                    id={id}
                    className={cn(
                        SelectVariants({ size }),
                        error && 'border-red-500 focus-visible:ring-red-500',
                        className
                    )}
                    {...props}
                >
                    {options.map(option => {
                        return (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        );
                    })}
                </select>
                <div className="text-muted pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
                    <ChevronDown className="h-4 w-4" />
                </div>
            </div>
            {error && (
                <p className="text-xs font-medium text-red-500">{error}</p>
            )}
        </div>
    );
}

Select.displayName = 'Select';

export default Select;
