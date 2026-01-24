import { registerWithEmailAction } from '@/(presentation)/user/actions/register-with-email.action';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';

export function useEmailRegisterMutation() {
    const router = useRouter();

    const { isError, isPending, isSuccess, mutate } = useMutation({
        mutationFn: async (formData: FormData) =>
            await registerWithEmailAction(formData),
        onSuccess: async () => {
            toast.success('회원가입이 완료되었습니다.');
            router.push('/login');
        },
        onError: error => {
            console.error('useEmailRegisterMutation', error);
            toast.error(
                error.message ?? '알 수 없는 오류로 회원가입에 실패했습니다.'
            );
        },
    });

    return {
        register: mutate,
        isPending,
        isSuccess,
        isError,
    };
}
