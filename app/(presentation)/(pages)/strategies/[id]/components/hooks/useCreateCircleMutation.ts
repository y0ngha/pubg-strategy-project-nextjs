import { getQueryClient } from '@/(presentation)/shared/helpers/query-client.helpers';
import { useMutation } from '@tanstack/react-query';
import { useGetCurrentUser } from '@/(presentation)/shared/hooks/useGetCurrentUser';
import { toast } from 'react-toastify';
import { ReactQueryKeys } from '@/(presentation)/shared/constants/react-query-keys';
import { GetStrategyAction } from '@/(presentation)/strategy/actions/get-strategy.action';
import { createCircleAction } from '@/(presentation)/strategy/actions/circle/create-circle.action';

export function useCreateCircleMutation(strategyId: string) {
    const queryClient = getQueryClient();
    const user = useGetCurrentUser();

    const { mutate } = useMutation({
        mutationFn: async (phase: number) => {
            const formData = new FormData();

            formData.set('userId', user.data?.id ?? '');
            formData.set('strategyId', strategyId);
            formData.set('phase', phase.toString());

            return await createCircleAction(formData);
        },
        onSuccess: data => {
            const strataegyQueryKey = [ReactQueryKeys.STRATIGES, strategyId];

            queryClient.invalidateQueries({
                queryKey: [user.data?.id, ReactQueryKeys.STRATIGES],
            });

            queryClient.setQueryData<GetStrategyAction>(
                strataegyQueryKey,
                oldStrategy => {
                    if (!oldStrategy) {
                        return undefined;
                    }

                    return {
                        ...oldStrategy,
                        circles: [
                            ...oldStrategy.circles,
                            {
                                id: data.id,
                                centerPosition: data.centerPosition,
                                phase: data.phase,
                                radius: data.radius,
                                color: data.color,
                            },
                        ],
                    };
                }
            );
        },
        onError: error => {
            console.error('useCreateCircleMutation', error);
            toast.error(
                error.message ?? '알 수 없는 오류로 자기장 생성에 실패했습니다.'
            );
        },
    });

    return {
        createCircle: mutate,
    };
}
