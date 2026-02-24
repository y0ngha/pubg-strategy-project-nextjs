import { getQueryClient } from '@/(presentation)/shared/helpers/query-client.helpers';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { ReactNode } from 'react';
import { ReactQueryKeys } from '@/(presentation)/shared/constants/react-query-keys';
import { getUserIdByCookieStore } from '@/(presentation)/dehydrate-components/utils/get-user-id.util';
import { getFriendListAction } from '@/(presentation)/friend/actions/get-friend-list.action';

export default async function FriendsDehydrate({
    children,
}: {
    children: ReactNode;
}) {
    const userId = await getUserIdByCookieStore();

    if (!userId) {
        return children;
    }

    const queryClient = getQueryClient();

    await queryClient.prefetchQuery({
        queryKey: [ReactQueryKeys.FRIENDS_ALL, userId],
        queryFn: async () => await getFriendListAction(),
    });

    const dehydratedState = dehydrate(queryClient);

    return (
        <HydrationBoundary state={dehydratedState}>
            {children}
        </HydrationBoundary>
    );
}
