import { getQueryClient } from '@/(presentation)/shared/helpers/query-client.helpers';
import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import {
    CreateStrategyAction,
    createStrategyAction,
} from '@/(presentation)/strategy/actions/strategy/create-strategy.action';
import { toast } from 'react-toastify';
import { useGetCurrentUser } from '@/(presentation)/shared/hooks/useGetCurrentUser';
import { ReactQueryKeys } from '@/(presentation)/shared/constants/react-query-keys';
import { DefaultError, MutationFunctionContext } from '@tanstack/query-core';

export function useCreateStrategyMutation(
    options?: Omit<
        UseMutationOptions<
            CreateStrategyAction,
            DefaultError,
            FormData,
            unknown
        >,
        'mutationFn'
    >
) {
    const queryClient = getQueryClient();
    const { data: user } = useGetCurrentUser();

    const {
        mutate: createStrategy,
        data,
        isError,
        isPending,
        isSuccess,
    } = useMutation({
        mutationFn: async (formData: FormData) => {
            formData.set('userId', user?.id ?? '');
            formData.set('userEmail', user?.email ?? '');

            return await createStrategyAction(formData);
        },
        onSuccess: (
            data: CreateStrategyAction,
            variables: FormData,
            onMutateResult: unknown,
            context: MutationFunctionContext
        ) => {
            queryClient.invalidateQueries({
                queryKey: [user?.id, ReactQueryKeys.STRATIGES],
            });

            options?.onSuccess?.(data, variables, onMutateResult, context);
        },
        onError: error => {
            console.error('useCreateStrategyMutation', error);
            toast.error(
                error.message ?? '알 수 없는 오류로 전략 생성에 실패했습니다.'
            );
        },
    });

    return {
        createStrategy,
        data,
        isError,
        isPending,
        isSuccess,
    };
}
