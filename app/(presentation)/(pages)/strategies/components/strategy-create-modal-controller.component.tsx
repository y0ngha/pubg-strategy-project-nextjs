'use client';

import { cloneElement, ReactElement, useState } from 'react';

interface StrategyCreateModalControllerProps {
    trigger: ReactElement<{ onClick: () => void }>;
    modal: ReactElement<{ isOpen: boolean; onClose: () => void }>;
}

function StrategyCreateModalController({
    trigger,
    modal,
}: StrategyCreateModalControllerProps) {
    const [isOpen, setIsOpen] = useState<boolean>(false);

    const open = () => {
        setIsOpen(true);
    };

    const close = () => {
        setIsOpen(false);
    };

    return (
        <>
            {cloneElement(trigger, { onClick: open })}
            {cloneElement(modal, {
                isOpen,
                onClose: close,
            })}
        </>
    );
}

StrategyCreateModalController.displayName = 'StrategyCreateModalController';

export default StrategyCreateModalController;
