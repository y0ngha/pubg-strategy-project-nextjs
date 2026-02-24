import { getQueryClient } from '@/(presentation)/shared/helpers/query-client.helpers';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { ReactNode } from 'react';
import { ReactQueryKeys } from '@/(presentation)/shared/constants/react-query-keys';
import { getCurrentUserAction } from '@/(presentation)/users/actions/get-current-user.action';

export default async function UserDehydrate({
    children,
}: {
    children: ReactNode;
}) {
    const queryClient = getQueryClient();

    await queryClient.prefetchQuery({
        queryKey: [ReactQueryKeys.GET_CURRENT_USER],
        queryFn: async () => await getCurrentUserAction(),
    });

    const dehydratedState = dehydrate(queryClient);

    return (
        <HydrationBoundary state={dehydratedState}>
            {children}
        </HydrationBoundary>
    );
}
