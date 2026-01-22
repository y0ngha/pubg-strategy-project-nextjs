import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { ReactQueryKeys } from '@/(presentation)/shared/constants/react-query-keys';
import { getCurrentUserAction } from '@/(presentation)/user/actions/get-current-user.action';

export function useGetCurrentUser(options?: UseQueryOptions) {
    return useQuery({
        queryKey: [ReactQueryKeys.GET_CURRENT_USER],
        queryFn: async () => await getCurrentUserAction(),
        staleTime: 1000 * 60 * 60,
        gcTime: 1000 * 60 * 60 * 24,
        retry: false,
        ...options,
    });
}
