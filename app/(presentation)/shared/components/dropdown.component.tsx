'use client';

import React, {
    Children,
    cloneElement,
    createContext,
    Dispatch,
    HTMLAttributes,
    isValidElement,
    ReactNode,
    RefAttributes,
    RefObject,
    SetStateAction,
    useEffect,
    useRef,
    useState,
} from 'react';
import { cn } from '@/(presentation)/shared/utils/class-names.util';
import { useSafetyContext } from '@/(presentation)/shared/hooks/useSafetyContext';
import Button from '@/(presentation)/shared/components/button.component';
import { cva, VariantProps } from 'class-variance-authority';
import { useDropdownPosition } from '@/(presentation)/shared/hooks/useDropdownPosition';
import { createPortal } from 'react-dom';

interface DropdownContextValue {
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
    dropdownRef: RefObject<HTMLDivElement | null>;
    triggerRef: RefObject<HTMLElement | null>;
    defaultTriggerRef: RefObject<HTMLButtonElement | null>;
}

const DropdownContext = createContext<DropdownContextValue | undefined>(
    undefined
);

const ContentVariants = cva(
    'bg-background border-border text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 absolute z-50 mt-2 w-56 min-w-32 origin-top-right rounded-md border p-1 shadow-md',
    {
        variants: {
            align: {
                end: 'right-0',
                start: 'left-0',
                center: 'left-1/2 -translate-x-1/2',
            },
        },
    }
);

interface ContentProps
    extends
        HTMLAttributes<HTMLDivElement>,
        VariantProps<typeof ContentVariants> {}

interface TriggerProps extends HTMLAttributes<HTMLElement> {
    asChild?: boolean;
}

function Dropdown({ children }: { children: ReactNode }) {
    const [open, setOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLElement>(null);
    const defaultTriggerRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                containerRef.current &&
                !containerRef.current.contains(event.target as Node)
            ) {
                setOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <DropdownContext.Provider
            value={{
                open,
                setOpen,
                dropdownRef,
                triggerRef,
                defaultTriggerRef,
            }}
        >
            <div
                ref={containerRef}
                className={'relative inline-block cursor-pointer text-left'}
            >
                {children}
            </div>
        </DropdownContext.Provider>
    );
}

function Trigger({
    children,
    asChild,
    className,
    onClick,
    ...props
}: TriggerProps) {
    const context = useSafetyContext(
        DropdownContext,
        'Dropdown.Trigger는 Dropdown 컴포넌트 내부에서만 사용할 수 있습니다.'
    );

    const handleToggle = (e: React.MouseEvent<HTMLElement>) => {
        context.setOpen(!context.open);
        onClick?.(e);
    };

    if (asChild) {
        const child = Children.only(children);

        if (
            !isValidElement<
                RefAttributes<HTMLElement> & HTMLAttributes<HTMLElement>
            >(child)
        ) {
            throw new Error(
                'Dropdown.Trigger 내부 요소가 하나가 아니거나, ReactElement가 아닙니다.'
            );
        }

        return cloneElement(child, {
            ...props,
            ref: context?.triggerRef,
            className: cn(child.props.className, className),
            onClick: (e: React.MouseEvent<HTMLElement>) => {
                child.props.onClick?.(e);
                handleToggle(e);
            },
        });
    }

    return (
        <Button
            ref={context?.defaultTriggerRef}
            variant={'ghost'}
            onClick={handleToggle}
            className={cn('cursor-pointer', className)}
            type={'button'}
            {...props}
        >
            {children}
        </Button>
    );
}

function Content({ align, children, className, ...props }: ContentProps) {
    const context = useSafetyContext(
        DropdownContext,
        'Dropdown.Content Dropdown 컴포넌트 내부에서만 사용할 수 있습니다.'
    );

    const position = useDropdownPosition(
        context?.dropdownRef,
        context?.triggerRef ?? context?.defaultTriggerRef,
        context?.open
    );

    if (!context.open) return null;

    return createPortal(
        <div
            className={cn(ContentVariants({ align }), className)}
            {...props}
            ref={context?.dropdownRef}
            style={{
                position: 'fixed',
                top: position?.top,
                left: position?.left,
            }}
        >
            {children}
        </div>,
        document.body
    );
}

function Item({
    onClick,
    className,
    children,
    ...props
}: HTMLAttributes<HTMLDivElement>) {
    const context = useSafetyContext(
        DropdownContext,
        'Dropdown.Item은 Dropdown 컴포넌트 내부에서만 사용할 수 있습니다.'
    );

    const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (onClick) onClick(e);

        context?.setOpen(false);
    };

    return (
        <div
            onClick={handleClick}
            className={cn(
                'hover:bg-muted/50 relative flex cursor-pointer items-center rounded-sm px-2 py-1.5 text-sm transition-colors outline-none select-none disabled:pointer-events-none disabled:opacity-50',
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
}

function Label({
    children,
    className,
    ...props
}: HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            className={cn('px-2 py-1.5 text-sm font-semibold', className)}
            {...props}
        >
            {children}
        </div>
    );
}

function Separator({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
    return (
        <div className={cn('bg-muted -mx-1 my-1 h-px', className)} {...props} />
    );
}

Dropdown.displayName = 'Dropdown';
Trigger.displayName = 'Dropdown.Trigger';
Content.displayName = 'Dropdown.Content';
Item.displayName = 'Dropdown.Item';
Label.displayName = 'Dropdown.Label';
Separator.displayName = 'Dropdown.Separator';

Dropdown.Trigger = Trigger;
Dropdown.Content = Content;
Dropdown.Item = Item;
Dropdown.Label = Label;
Dropdown.Separator = Separator;

export default Dropdown;
