import { useGetFriends } from './queries/useGetFriends';

export function useFriendSummary() {
    const { data, isPending } = useGetFriends();

    return {
        description: `함께하는 친구 ${data?.friendCount}명 | 받은 친구 요청 ${data?.receivedFriendRequestCount}명`,
        isPending,
    };
}
