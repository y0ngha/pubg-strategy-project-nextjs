'use client';

import {
    createContext,
    Dispatch,
    ReactNode,
    SetStateAction,
    useState,
} from 'react';
import Alert from '@/(presentation)/shared/modals/alert.modal';

type ModalData = { title: string; content: ReactNode };

interface AlertContextValue {
    isOpen: boolean;
    setIsOpen: Dispatch<SetStateAction<boolean>>;
    modalData: ModalData;
    setModalData: Dispatch<SetStateAction<ModalData>>;
}

export const AlertContext = createContext<AlertContextValue | undefined>(
    undefined
);

function AlertProvider({ children }: { children: ReactNode }) {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [modalData, setModalData] = useState<ModalData>({
        title: '',
        content: <></>,
    });

    return (
        <AlertContext.Provider
            value={{ isOpen, setIsOpen, modalData, setModalData }}
        >
            {children}
            <Alert
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                title={modalData.title}
                content={modalData.content}
            />
        </AlertContext.Provider>
    );
}

AlertProvider.displayName = 'AlertProvider';

export default AlertProvider;
