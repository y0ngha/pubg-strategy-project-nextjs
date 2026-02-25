import Modal from '@/(presentation)/shared/components/modal.component';
import Button from '@/(presentation)/shared/components/button.component';
import Select from '@/(presentation)/shared/components/select.component';
import { useState } from 'react';

interface EnterTeamLabelModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (teamLabel: string) => void;
}

function EnterTeamLabelModal({
    isOpen,
    onClose,
    onConfirm,
}: EnterTeamLabelModalProps) {
    const labels = Array.from({ length: 26 }, (_, i) =>
        String.fromCharCode(i + 65)
    );
    const [selectedTeamLabel, setSelectedTeamLabel] = useState<string>(
        labels[0]
    );

    return (
        <Modal open={isOpen} onClose={onClose}>
            <Modal.Header>
                <Modal.Title>적 팀 라벨 선택</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Select
                    label={'라벨 선택'}
                    onChange={event => {
                        const teamLabel = event.target.value;

                        setSelectedTeamLabel(teamLabel);
                    }}
                >
                    {labels.map(label => {
                        return (
                            <Select.Option key={label} value={label}>
                                {label}
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
                    onClick={() => onConfirm(selectedTeamLabel)}
                >
                    생성
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

EnterTeamLabelModal.displayName = 'EnterTeamLabelModal';

export default EnterTeamLabelModal;
