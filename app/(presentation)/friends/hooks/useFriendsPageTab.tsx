import { useState } from 'react';
import { GetFriendResponseDto } from '@/application/friend/dto/get-friend-list.dto';
import FriendsTabs from '@/(presentation)/(pages)/mypage/friends/_components/friends-tabs.component';
import FriendsTabsContent from '@/(presentation)/(pages)/mypage/friends/_components/friends-tabs-content.component';

export const MY_FIRENDS_TAB = 'FRIENDS';
export const RECEIVED_FRIEND_REQUESTS_TAB = 'RECEIVED_FRIEND_REQUESTS';
export const SEND_FRIEND_REQUESTS_TAB = 'SEND_FRIEND_REQUESTS';

export function useFriendsPageTab(
    friends: GetFriendResponseDto[],
    receivedFriendRequests: GetFriendResponseDto[],
    sentFriendRequests: GetFriendResponseDto[]
) {
    const tabs = [
        {
            value: MY_FIRENDS_TAB,
            title: `내 친구 ${friends.length}`,
        },
        {
            value: RECEIVED_FRIEND_REQUESTS_TAB,
            title: `받은 친구 요청 ${receivedFriendRequests.length}`,
        },
        {
            value: SEND_FRIEND_REQUESTS_TAB,
            title: `보낸 친구 요청 ${sentFriendRequests.length}`,
        },
    ];

    const [activeTab, setActiveTab] = useState(tabs[0].value);

    const TabHeader = () => {
        return (
            <FriendsTabs
                onTabChange={setActiveTab}
                activeTab={activeTab}
                tabs={tabs}
            />
        );
    };

    const TabContent = () => {
        return (
            <FriendsTabsContent
                activeTab={activeTab}
                friends={friends}
                receivedFriendRequests={receivedFriendRequests}
                sentFriendRequests={sentFriendRequests}
            />
        );
    };

    return {
        TabHeader,
        TabContent,
    };
}
