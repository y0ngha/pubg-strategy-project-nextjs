'use client';

import React, { useContext, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/(presentation)/shared/utils/class-names.util';
import { X } from 'lucide-react';

interface ModalContextValue {
    open: boolean;
    onClose: () => void;
}

const ModalContext = React.createContext<ModalContextValue | undefined>(
    undefined
);

function useModalContext() {
    const context = useContext(ModalContext);

    if (!context)
        throw new Error(
            'Modal.* 컴포넌트는 Modal 컴포넌트 안에 위치해야합니다.'
        );

    return context;
}

interface ModalProps
    extends ModalContextValue, React.HTMLAttributes<HTMLDivElement> {
    closeableByEsc?: boolean;
}

function Modal({ closeableByEsc = true, open, onClose, children }: ModalProps) {
    const escKeydownHandler = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
            onClose();
        }
    };

    const modalSetup = () => {
        document.body.style.overflow = 'hidden';

        if (closeableByEsc) {
            window.addEventListener('keydown', escKeydownHandler);
        }
    };

    const modalCleanup = () => {
        document.body.style.overflow = 'unset';

        if (closeableByEsc) {
            window.removeEventListener('keydown', escKeydownHandler);
        }
    };

    useEffect(() => {
        if (open) {
            modalSetup();

            return modalCleanup;
        }
    }, [modalCleanup, modalSetup, open]);

    if (!open) return null;

    return createPortal(
        <ModalContext.Provider value={{ open, onClose }}>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0">
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                    onClick={onClose}
                />
                <div className="relative z-50 w-full sm:max-w-lg">
                    {children}
                </div>
            </div>
        </ModalContext.Provider>,
        document.body
    );
}

interface HeaderProps extends React.HTMLAttributes<HTMLDivElement> {
    closeIconHide?: boolean;
}

function Header({
    closeIconHide = false,
    children,
    className,
    ...props
}: HeaderProps) {
    const context = useModalContext();

    return (
        <div
            className={cn(
                'border-border flex items-center justify-between border-b px-6 py-4',
                className
            )}
            {...props}
        >
            {children}
            {!closeIconHide && (
                <button
                    role={'close'}
                    onClick={context.onClose}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                >
                    <X className="h-5 w-5" />
                </button>
            )}
        </div>
    );
}

function Title({
    children,
    className,
    ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
    return (
        <h3
            className={cn('text-foreground text-lg font-semibold', className)}
            {...props}
        >
            {children}
        </h3>
    );
}

function Body({
    children,
    className,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div className={cn('text-foreground px-6 py-6', className)} {...props}>
            {children}
        </div>
    );
}

function Footer({
    className,
    children,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            className={cn(
                'border-border bg-surface/50 flex justify-end gap-2 border-t px-6 py-4',
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
}

Modal.Header = Header;
Modal.Title = Title;
Modal.Body = Body;
Modal.Footer = Footer;

Modal.displayName = 'Modal';

export default Modal;
