'use client';

import { cva, VariantProps } from 'class-variance-authority';
import React, { ReactNode, useId } from 'react';
import { cn } from '@/(presentation)/shared/utils/class-names.util';
import { ChevronDown } from 'lucide-react';

type OptionValue = string;

const SelectVariants = cva(
    'w-full appearance-none rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 pr-8',
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
    disabled?: boolean;
    value?: OptionValue;
    onValueChange?: (value: OptionValue) => void;
}

function Select({
    size,
    label,
    error,
    disabled,
    value,
    onValueChange,
    children,
    className,
    ...props
}: SelectProps) {
    const id = useId();
    return (
        <div className={'space-y-1'}>
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
            <div className="relative">
                <select
                    id={id}
                    disabled={disabled}
                    value={value}
                    onChange={e => onValueChange?.(e.target.value)}
                    className={cn(
                        SelectVariants({ size }),
                        error && 'border-red-500 focus-visible:ring-red-500',
                        className
                    )}
                    {...props}
                >
                    {children}
                </select>

                <div className="text-muted-foreground pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
                    <ChevronDown className="h-4 w-4" />
                </div>
            </div>
            {error && (
                <p className="text-xs font-medium text-red-500">{error}</p>
            )}
        </div>
    );
}

interface OptionProps {
    value: OptionValue;
    children: ReactNode;
}

function Option({ value, children }: OptionProps) {
    return <option value={value}>{children}</option>;
}

Select.Option = Option;
Select.displayName = 'Select';

export default Select;
