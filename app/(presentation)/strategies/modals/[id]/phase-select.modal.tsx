import Modal from '@/(presentation)/shared/components/modal.component';
import Button from '@/(presentation)/shared/components/button.component';
import Select from '@/(presentation)/shared/components/select.component';
import { useState } from 'react';

interface PhaseSelectModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (phase: number) => void;
}

function PhaseSelectModal({
    isOpen,
    onClose,
    onConfirm,
}: PhaseSelectModalProps) {
    const phases = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    const [selectedPhase, setSelectedPhase] = useState<number>(phases[0]);

    return (
        <Modal open={isOpen} onClose={onClose}>
            <Modal.Header>
                <Modal.Title>자기장 페이즈 선택</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Select
                    label={'페이즈 선택'}
                    onChange={event => {
                        const phase = Number(event.target.value);

                        setSelectedPhase(phase);
                    }}
                >
                    {phases.map(phase => {
                        return (
                            <Select.Option key={phase} value={phase.toString()}>
                                {phase}페이즈
                            </Select.Option>
                        );
                    })}
                </Select>
            </Modal.Body>
            <Modal.Footer>
                <Button type={'button'} variant={'secondary'} onClick={onClose}>
                    취소
                </Button>
                <Button
                    type={'submit'}
                    variant={'primary'}
                    onClick={() => onConfirm(selectedPhase)}
                >
                    생성
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

PhaseSelectModal.displayName = 'PhaseSelectModal';

export default PhaseSelectModal;
