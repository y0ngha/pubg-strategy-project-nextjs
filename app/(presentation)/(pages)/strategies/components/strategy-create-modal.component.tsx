'use client';

import Modal from '@/(presentation)/shared/components/modal.component';
import Button from '@/(presentation)/shared/components/button.component';
import Input from '@/(presentation)/shared/components/input.component';
import Select from '@/(presentation)/shared/components/select.component';
import { PubgMapNames } from '@domain/strategy/enums/map.enum';

interface StrategyCreateModalProps {
    isOpen?: boolean;
    onClose?: () => void;
}

function StrategyCreateModal({
    isOpen = false,
    onClose = () => {},
}: StrategyCreateModalProps) {
    return (
        <Modal open={isOpen ?? false} onClose={onClose}>
            <Modal.Header>
                <Modal.Title>전략 생성</Modal.Title>
            </Modal.Header>

            <Modal.Body className={'flex flex-col gap-4'}>
                <Input type={'text'} label={'전략 제목'} />
                <Select onValueChange={() => {}} label={'맵'}>
                    {Object.values(PubgMapNames).map(pubgMapName => {
                        return (
                            <Select.Option
                                value={PubgMapNames[pubgMapName]}
                                key={pubgMapName}
                            >
                                {pubgMapName}
                            </Select.Option>
                        );
                    })}
                </Select>
            </Modal.Body>
            <Modal.Footer>
                <Button variant={'secondary'}>취소</Button>
                <Button variant={'primary'}>생성</Button>
            </Modal.Footer>
        </Modal>
    );
}

StrategyCreateModal.displayName = 'StrategyCreateModal';

export default StrategyCreateModal;
