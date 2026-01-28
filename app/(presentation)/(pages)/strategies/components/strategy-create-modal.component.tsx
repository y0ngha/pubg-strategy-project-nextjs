'use client';

import Modal from '@/(presentation)/shared/components/modal.component';
import Button from '@/(presentation)/shared/components/button.component';
import Input from '@/(presentation)/shared/components/input.component';
import Select from '@/(presentation)/shared/components/select.component';
import { PubgMap, PubgMapNames } from '@domain/strategy/enums/map.enum';
import { useCreateStrategyMutation } from '@/(presentation)/(pages)/strategies/hooks/useCreateStrategyMutation';
import { useRouter } from 'next/navigation';
import { Route } from '@/(presentation)/shared/constants/route';
import { SubmitHandler, useForm } from 'react-hook-form';

interface StrategyCreateFormInputs {
    title: string;
    map: string;
}

interface StrategyCreateModalProps {
    isOpen?: boolean;
    onClose?: () => void;
}

function StrategyCreateModal({
    isOpen = false,
    onClose = () => {},
}: StrategyCreateModalProps) {
    const router = useRouter();

    const { createStrategy } = useCreateStrategyMutation({
        onSuccess: data => {
            router.push(`${Route.STRATEGIES}/${data.id}`);
        },
    });

    const { register, handleSubmit } = useForm<StrategyCreateFormInputs>();

    const onSubmit: SubmitHandler<StrategyCreateFormInputs> = data => {
        const formData = new FormData();
        formData.set('title', data.title);
        formData.set('map', data.map);

        createStrategy(formData);
    };

    return (
        <Modal open={isOpen ?? false} onClose={onClose}>
            <Modal.Header>
                <Modal.Title>전략 생성</Modal.Title>
            </Modal.Header>

            <form onSubmit={handleSubmit(onSubmit)}>
                <Modal.Body className={'flex flex-col gap-4'}>
                    <Input
                        {...register('title')}
                        type={'text'}
                        label={'전략 제목'}
                    />
                    <Select {...register('map')} label={'맵'}>
                        {Object.values(PubgMap).map(pubgMapKey => {
                            return (
                                <Select.Option
                                    value={pubgMapKey}
                                    key={pubgMapKey}
                                >
                                    {PubgMapNames[pubgMapKey]}
                                </Select.Option>
                            );
                        })}
                    </Select>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        type={'button'}
                        variant={'secondary'}
                        onClick={onClose}
                    >
                        취소
                    </Button>
                    <Button type={'submit'} variant={'primary'}>
                        생성
                    </Button>
                </Modal.Footer>
            </form>
        </Modal>
    );
}

StrategyCreateModal.displayName = 'StrategyCreateModal';

export default StrategyCreateModal;
