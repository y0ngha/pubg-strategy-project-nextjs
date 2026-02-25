'use client';

import Modal from '@/(presentation)/shared/components/modal.component';
import { ReactNode } from 'react';
import Button from '@/(presentation)/shared/components/button.component';

interface ConfirmProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    content: ReactNode;
}

function Confirm({ isOpen, onClose, onConfirm, title, content }: ConfirmProps) {
    return (
        <Modal open={isOpen} onClose={onClose}>
            <Modal.Header>
                <Modal.Title>{title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>{content}</Modal.Body>
            <Modal.Footer>
                <Button variant={'secondary'} onClick={onClose}>
                    취소
                </Button>
                <Button
                    variant={'primary'}
                    onClick={() => {
                        onConfirm();
                        onClose();
                    }}
                >
                    확인
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

Confirm.displayName = 'Confirm';

export default Confirm;
