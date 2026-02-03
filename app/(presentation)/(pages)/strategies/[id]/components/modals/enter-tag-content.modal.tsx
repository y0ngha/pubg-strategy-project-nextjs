import Modal from '@/(presentation)/shared/components/modal.component';
import Button from '@/(presentation)/shared/components/button.component';
import Input from '@/(presentation)/shared/components/input.component';
import { ChangeEvent, useState } from 'react';

interface EnterTagContentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (content: string) => void;
}

function EnterTagContentModal({
    isOpen,
    onClose,
    onConfirm,
}: EnterTagContentModalProps) {
    const [content, setContent] = useState<string>('');

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        setContent(event.target.value.trim());
    };

    return (
        <Modal open={isOpen} onClose={onClose}>
            <Modal.Header>
                <Modal.Title>태그 내용 입력</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Input
                    type={'text'}
                    label={'내용 입력'}
                    placeholder={'성당 고정젠'}
                    value={content}
                    onChange={handleChange}
                />
            </Modal.Body>
            <Modal.Footer>
                <Button type={'button'} variant={'secondary'} onClick={onClose}>
                    취소
                </Button>
                <Button
                    type={'submit'}
                    variant={'primary'}
                    onClick={() => onConfirm(content)}
                >
                    생성
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

EnterTagContentModal.displayName = 'EnterTagContentModal';

export default EnterTagContentModal;
