import { useState } from 'react';
import PasswordChangeModal from '@/(presentation)/auth/modals/password-change.modal';

export function usePasswordChangeModal() {
    const [isOpen, setIsOpen] = useState<boolean>(false);

    const open = () => setIsOpen(true);
    const close = () => setIsOpen(false);

    const Modal = () => <PasswordChangeModal isOpen={isOpen} onClose={close} />;

    return {
        openPasswordModal: open,
        PasswordChangeModal: Modal,
    };
}
