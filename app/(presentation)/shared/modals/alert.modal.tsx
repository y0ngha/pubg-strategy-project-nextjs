'use client';

import Modal from '@/(presentation)/shared/components/modal.component';
import { ReactNode } from 'react';
import Button from '@/(presentation)/shared/components/button.component';

interface AlertProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    content: ReactNode;
}

function Alert({ isOpen, onClose, title, content }: AlertProps) {
    return (
        <Modal open={isOpen} onClose={onClose}>
            <Modal.Header>
                <Modal.Title>{title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>{content}</Modal.Body>
            <Modal.Footer>
                <Button variant={'primary'} onClick={onClose}>
                    확인
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

Alert.displayName = 'Alert';

export default Alert;
