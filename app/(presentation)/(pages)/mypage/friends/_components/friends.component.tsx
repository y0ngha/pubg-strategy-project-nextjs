'use client';

import { useFriendsPageTab } from '@/(presentation)/friends/hooks/useFriendsPageTab';
import { useGetFriends } from '@/(presentation)/friends/hooks/queries/useGetFriends';

function Friends() {
    const { data } = useGetFriends();

    const { TabHeader, TabContent } = useFriendsPageTab(
        data?.friends ?? [],
        data?.receivedFriendRequests ?? [],
        data?.sentFriendRequests ?? []
    );

    return (
        <>
            <TabHeader />
            <TabContent />
        </>
    );
}

export default Friends;
