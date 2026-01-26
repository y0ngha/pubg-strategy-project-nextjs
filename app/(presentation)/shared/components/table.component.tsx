'use client';

import { cn } from '@/(presentation)/shared/utils/class-names.util';
import React, { Ref, useId } from 'react';
import { useSafetyContext } from '@/(presentation)/shared/hooks/useSafetyContext';

type TableRowId = string;

interface TableContextValue {
    onRowClick?: (id: TableRowId) => void;
    clickable?: boolean;
}

const TableContext = React.createContext<TableContextValue | undefined>(
    undefined
);

interface TableProps extends React.ComponentProps<'table'>, TableContextValue {
    containerRef?: Ref<HTMLDivElement>;
    containerClassName?: string;
}

function Table({
    onRowClick,
    clickable = true,
    className,
    containerRef,
    containerClassName,
    ...props
}: TableProps) {
    return (
        <TableContext.Provider value={{ onRowClick, clickable }}>
            <div
                className={cn(
                    'relative w-full overflow-auto',
                    containerClassName
                )}
                ref={containerRef}
            >
                <table
                    className={cn('w-full caption-bottom text-sm', className)}
                    {...props}
                />
            </div>
        </TableContext.Provider>
    );
}

function Header({ className, ...props }: React.ComponentProps<'thead'>) {
    return <thead className={cn('[&_tr]:border-b', className)} {...props} />;
}

function Body({ className, ...props }: React.ComponentProps<'tbody'>) {
    return (
        <tbody
            className={cn('[&_tr:last-child]:border-0', className)}
            {...props}
        />
    );
}

function Footer({ className, ...props }: React.ComponentProps<'tfoot'>) {
    return (
        <tfoot
            className={cn(
                'bg-muted/50 border-t font-medium [&>tr]:last:border-b-0',
                className
            )}
            {...props}
        />
    );
}

interface RowProps extends React.ComponentProps<'tr'> {
    id?: TableRowId;
    isHeading?: boolean;
}

function Row({ id, isHeading = false, className, ...props }: RowProps) {
    const context = useSafetyContext(
        TableContext,
        'Table.* 컴포넌트는 Table 컴포넌트 안에 위치해야합니다.'
    );

    const rowId = useId();

    const onClick = () => {
        context.onRowClick?.(id ?? rowId);
    };

    return (
        <tr
            className={cn(
                !isHeading &&
                    'hover:bg-muted/50 data-[state=selected]:bg-muted border-b transition-colors',
                context.clickable && !isHeading && 'cursor-pointer',
                className
            )}
            onClick={
                context.onRowClick !== undefined && !isHeading
                    ? onClick
                    : undefined
            }
            {...props}
        />
    );
}

function Head({ className, ...props }: React.ComponentProps<'th'>) {
    return (
        <th
            className={cn(
                'text-muted-foreground h-12 px-4 text-left align-middle font-medium [&:has([role=checkbox])]:pr-0',
                className
            )}
            {...props}
        />
    );
}

function Cell({ className, ...props }: React.ComponentProps<'td'>) {
    return (
        <td
            className={cn(
                'p-4 align-middle [&:has([role=checkbox])]:pr-0',
                className
            )}
            {...props}
        />
    );
}

function Caption({ className, ...props }: React.ComponentProps<'caption'>) {
    return (
        <caption
            className={cn('text-muted-foreground mt-4 text-sm', className)}
            {...props}
        />
    );
}

Table.Header = Header;
Table.Body = Body;
Table.Footer = Footer;
Table.Row = Row;
Table.Head = Head;
Table.Cell = Cell;
Table.Caption = Caption;

Table.displayName = 'Table';

export default Table;
