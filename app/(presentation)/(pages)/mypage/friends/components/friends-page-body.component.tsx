'use client';

import { useFriendsPageTab } from '@/(presentation)/(pages)/mypage/friends/hooks/useFriendsPageTab';
import { useGetFriends } from '@/(presentation)/(pages)/mypage/friends/hooks/useGetFriends';
import { GetFriendResponseDto } from '@/application/friend/dto/get-friend-list.dto';
import {
    FriendStatus,
    FriendStatusLabels,
} from '@domain/friend/enum/friend-status.enum';

const MOCK_FRIENDS: GetFriendResponseDto[] = [
    {
        id: '1',
        displayEmail: 'test@domain.com',
        status: FriendStatus.ACCEPTED,
        statusLabel: FriendStatusLabels[FriendStatus.ACCEPTED],
    },
    {
        id: '2',
        displayEmail: 'test2@domain.com',
        status: FriendStatus.ACCEPTED,
        statusLabel: FriendStatusLabels[FriendStatus.ACCEPTED],
    },
];

const MOCK_REQUESTS: GetFriendResponseDto[] = [
    {
        id: '3',
        displayEmail: 'test3@domain.com',
        status: FriendStatus.PENDING,
        statusLabel: FriendStatusLabels[FriendStatus.PENDING],
    },
];

const MOCK_SENT_REQUESTS: GetFriendResponseDto[] = [
    {
        id: '4',
        displayEmail: 'test4@domain.com',
        status: FriendStatus.PENDING,
        statusLabel: FriendStatusLabels[FriendStatus.PENDING],
    },
];

function FriendsPageBody() {
    const { data } = useGetFriends();

    const { TabHeader, TabContent } = useFriendsPageTab(
        data?.friends ?? MOCK_FRIENDS,
        data?.receivedFriendRequests ?? MOCK_REQUESTS,
        data?.sentFriendRequests ?? MOCK_SENT_REQUESTS
    );

    return (
        <>
            <TabHeader />
            <TabContent />
        </>
    );
}

export default FriendsPageBody;
