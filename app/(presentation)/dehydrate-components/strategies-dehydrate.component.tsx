import { ReactNode } from 'react';
import { getQueryClient } from '@/(presentation)/shared/helpers/query-client.helpers';
import { getOwnedStrategiesAction } from '@/(presentation)/strategy/actions/strategy/get-owned-strategies.action';
import { ReactQueryKeys } from '@/(presentation)/shared/constants/react-query-keys';
import { getSharedStrategiesAction } from '@/(presentation)/strategy/actions/strategy/get-shared-strategies.action';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { getUserIdByCookieStore } from '@/(presentation)/dehydrate-components/utils/get-user-id.util';

export default async function StrategiesDehydrate({
    children,
}: {
    children: ReactNode;
}) {
    const userId = await getUserIdByCookieStore();

    if (!userId) {
        return children;
    }

    const queryClient = getQueryClient();

    await Promise.all([
        queryClient.prefetchInfiniteQuery({
            queryKey: [ReactQueryKeys.STRATIGES_ALL],
            queryFn: async ({ pageParam }) =>
                await getOwnedStrategiesAction(pageParam, 15),
            initialPageParam: 1,
        }),
        queryClient.prefetchInfiniteQuery({
            queryKey: [ReactQueryKeys.SHARED_STRATIGES_ALL],
            queryFn: async ({ pageParam }) =>
                await getSharedStrategiesAction(pageParam, 15),
            initialPageParam: 1,
        }),
    ]);

    const dehydratedState = dehydrate(queryClient);

    return (
        <HydrationBoundary state={dehydratedState}>
            {children}
        </HydrationBoundary>
    );
}
