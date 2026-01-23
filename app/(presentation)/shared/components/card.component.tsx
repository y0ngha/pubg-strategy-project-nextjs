import React from 'react';
import { cn } from '@/(presentation)/shared/utils/class-names.util';

type CardProps = React.HTMLAttributes<HTMLDivElement>;

function Card({ children, className, ...props }: CardProps) {
    return (
        <div
            className={cn(
                'bg-card text-card-foreground rounded-lg border shadow-sm',
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
}

type HeaderProps = React.HTMLAttributes<HTMLDivElement>;

function Header({ children, className, ...props }: HeaderProps) {
    return (
        <div
            className={cn('flex flex-col space-y-1.5 p-6', className)}
            {...props}
        >
            {children}
        </div>
    );
}

type TitleProps = React.HTMLAttributes<HTMLHeadingElement>;

function Title({ children, className, ...props }: TitleProps) {
    return (
        <h3
            className={cn(
                'text-2xl leading-none font-semibold tracking-tight',
                className
            )}
            {...props}
        >
            {children}
        </h3>
    );
}

type ContentProps = React.HTMLAttributes<HTMLDivElement>;

function Content({ children, className, ...props }: ContentProps) {
    return (
        <div className={cn('p-6 pt-0', className)} {...props}>
            {children}
        </div>
    );
}

Card.displayName = 'Card';
Header.displayName = 'Card-Header';
Title.displayName = 'Card-Title';
Content.displayName = 'Card-Content';

Card.Header = Header;
Card.Title = Title;
Card.Content = Content;

export default Card;
