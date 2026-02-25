'use client';

import {
    createContext,
    Dispatch,
    ReactNode,
    SetStateAction,
    useState,
} from 'react';
import Confirm from '@/(presentation)/shared/modals/confirm.modal';

type ModalData = { title: string; content: ReactNode; onConfirm: () => void };

interface ConfirmContextValue {
    isOpen: boolean;
    setIsOpen: Dispatch<SetStateAction<boolean>>;
    modalData: ModalData;
    setModalData: Dispatch<SetStateAction<ModalData>>;
}

export const ConfirmContext = createContext<ConfirmContextValue | undefined>(
    undefined
);

function ConfirmProvider({ children }: { children: ReactNode }) {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [modalData, setModalData] = useState<ModalData>({
        title: '',
        content: <></>,
        onConfirm: () => {},
    });

    return (
        <ConfirmContext.Provider
            value={{ isOpen, setIsOpen, modalData, setModalData }}
        >
            {children}
            <Confirm
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                title={modalData.title}
                content={modalData.content}
                onConfirm={modalData.onConfirm}
            />
        </ConfirmContext.Provider>
    );
}

ConfirmProvider.displayName = 'ConfirmProvider';

export default ConfirmProvider;
