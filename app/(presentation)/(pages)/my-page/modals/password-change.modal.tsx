import Modal from '@/(presentation)/shared/components/modal.component';
import Button from '@/(presentation)/shared/components/button.component';
import Input from '@/(presentation)/shared/components/input.component';
import { SubmitHandler, useForm } from 'react-hook-form';
import { usePasswordChangeMutation } from '@/(presentation)/(pages)/my-page/hooks/usePasswordChangeMutation';

interface PasswordChangeFormInputs {
    currentPassword: string;
    newPassword: string;
    confirmNewPassword: string;
}

interface PasswordChangeModalProps {
    isOpen: boolean;
    onClose: () => void;
}

function PasswordChangeModal({ isOpen, onClose }: PasswordChangeModalProps) {
    const { register, reset, handleSubmit, watch } =
        useForm<PasswordChangeFormInputs>();
    const { mutate: passwordChangeMutation, isPending } =
        usePasswordChangeMutation();

    const confirmNewPassword = watch('confirmNewPassword');
    const newPassword = watch('newPassword');

    const isMatch = !confirmNewPassword || newPassword === confirmNewPassword;

    const onSubmit: SubmitHandler<PasswordChangeFormInputs> = data => {
        const formData = new FormData();

        formData.set('currentPassword', data.currentPassword);
        formData.set('newPassword', data.newPassword);

        passwordChangeMutation(formData, {
            onError: () => {
                reset();
            },
        });
    };

    return (
        <Modal open={isOpen} onClose={onClose}>
            <Modal.Header>
                <Modal.Title>비밀번호 변경</Modal.Title>
            </Modal.Header>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Modal.Body className={'flex flex-col gap-2'}>
                    <Input
                        {...register('currentPassword')}
                        type={'password'}
                        label={'현재 비밀번호 입력'}
                        disabled={isPending}
                    />
                    <Input
                        {...register('newPassword')}
                        type={'password'}
                        label={'변경할 비밀번호 입력'}
                        disabled={isPending}
                    />
                    <Input
                        {...register('confirmNewPassword')}
                        type={'password'}
                        label={'변경할 비밀번호 재입력'}
                        disabled={isPending}
                        error={
                            !isMatch
                                ? '비밀번호가 일치하지 않습니다.'
                                : undefined
                        }
                    />
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        type={'button'}
                        variant={'secondary'}
                        onClick={onClose}
                    >
                        취소
                    </Button>
                    <Button type={'submit'} disabled={isPending || !isMatch}>
                        변경
                    </Button>
                </Modal.Footer>
            </form>
        </Modal>
    );
}

PasswordChangeModal.displayName = 'PasswordChangeModal';

export default PasswordChangeModal;
