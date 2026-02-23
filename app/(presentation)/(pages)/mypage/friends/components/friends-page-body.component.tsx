'use client';

import { useFriendsPageTab } from '@/(presentation)/(pages)/mypage/friends/hooks/useFriendsPageTab';
import { useGetFriends } from '@/(presentation)/(pages)/mypage/friends/hooks/useGetFriends';

function FriendsPageBody() {
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

export default FriendsPageBody;
