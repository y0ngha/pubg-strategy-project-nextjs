'use client';

import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/(presentation)/shared/utils/class-names.util';
import React from 'react';
import { useSafetyContext } from '@/(presentation)/shared/hooks/useSafetyContext';

interface TabsContextValue {
    value: string;
    onValueChange: (value: string) => void;
}

const TabsContext = React.createContext<TabsContextValue | undefined>(
    undefined
);

interface TabsProps
    extends React.HTMLAttributes<HTMLDivElement>, TabsContextValue {}

function Tabs({
    value,
    onValueChange,
    children,
    className,
    ...props
}: TabsProps) {
    return (
        <TabsContext.Provider value={{ value, onValueChange }}>
            <div className={cn('w-full', className)} {...props}>
                {children}
            </div>
        </TabsContext.Provider>
    );
}

function List({
    className,
    children,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            className={cn('border-border flex space-x-6 border-b', className)}
            role="tablist"
            {...props}
        >
            {children}
        </div>
    );
}

const TabsItemVariants = cva(
    'whitespace-nowrap border-b-2 px-1 py-4 text-sm font-medium transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:pointer-events-none disabled:opacity-50',
    {
        variants: {
            active: {
                true: 'border-primary text-primary',
                false: 'border-transparent text-muted hover:border-zinc-700 hover:text-zinc-300',
            },
        },
        defaultVariants: {
            active: false,
        },
    }
);

interface TabsItemProps
    extends
        React.ButtonHTMLAttributes<HTMLButtonElement>,
        VariantProps<typeof TabsItemVariants> {
    value: string;
}

function Item({ className, value, children, ...props }: TabsItemProps) {
    const context = useSafetyContext(
        TabsContext,
        'Tabs.* 컴포넌트는 Tabs 컴포넌트 안에 위치해야합니다.'
    );

    const isActive = context.value === value;

    return (
        <button
            type="button"
            role="tab"
            aria-selected={isActive}
            className={cn(TabsItemVariants({ active: isActive }), className)}
            onClick={() => context.onValueChange(value)}
            {...props}
        >
            {children}
        </button>
    );
}

Tabs.List = List;
Tabs.Item = Item;

Tabs.displayName = 'Tabs';

export { Tabs };
