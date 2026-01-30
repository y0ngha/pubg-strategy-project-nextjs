import { useMutation } from '@tanstack/react-query';
import { getQueryClient } from '@/(presentation)/shared/helpers/query-client.helpers';
import { useGetCurrentUser } from '@/(presentation)/shared/hooks/useGetCurrentUser';
import { ReactQueryKeys } from '@/(presentation)/shared/constants/react-query-keys';
import { toast } from 'react-toastify';
import { updateStrategyAction } from '@/(presentation)/strategy/actions/update-strategy.action';
import { GetStrategyAction } from '@/(presentation)/strategy/actions/get-strategy.action';

export function useUpdateStrategyMutation(strategyId: string) {
    const queryClient = getQueryClient();
    const { data: user } = useGetCurrentUser();

    const {
        mutate: updateStrategy,
        data,
        isError,
        isPending,
        isSuccess,
    } = useMutation({
        mutationFn: async (formData: FormData) => {
            formData.set('userId', user?.id ?? '');
            formData.set('strategyId', strategyId);

            return await updateStrategyAction(formData);
        },
        onSuccess: data => {
            queryClient.invalidateQueries({
                queryKey: [user?.id, ReactQueryKeys.STRATIGES],
            });

            queryClient.setQueryData<GetStrategyAction>(
                [ReactQueryKeys.STRATIGES, strategyId],
                oldStrategy => {
                    if (!oldStrategy) {
                        return undefined;
                    }

                    return {
                        ...oldStrategy,
                        title: data.title,
                        map: data.map,
                    };
                }
            );

            toast.success('전략이 수정되었습니다.');
        },
        onError: error => {
            console.error('useUpdateStrategyMutation', error);
            toast.error(
                error.message ?? '알 수 없는 오류로 전략 수정에 실패했습니다.'
            );
        },
    });

    return {
        updateStrategy,
        data,
        isError,
        isPending,
        isSuccess,
    };
}
