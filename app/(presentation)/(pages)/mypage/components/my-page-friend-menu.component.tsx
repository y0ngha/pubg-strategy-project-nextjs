'use client';

import MyPageMenuCard from '@/(presentation)/(pages)/mypage/components/my-page-menu-card.component';
import { Users } from 'lucide-react';
import { Route } from '@/(presentation)/shared/constants/route';
import { useGetFriends } from '@/(presentation)/shared/hooks/useGetFriends';
import { useRouter } from 'next/navigation';

function MyPageFriendMenu() {
    const { data, isPending } = useGetFriends();
    const router = useRouter();

    return (
        <MyPageMenuCard
            icon={<Users className={'text-blue-600'} />}
            title={'친구 관리'}
            description={`함께하는 친구 ${data?.friendCount}명 | 받은 친구 요청 ${data?.receivedFriendRequestCount}명`}
            isPending={isPending}
            handleClick={() => router.push(Route.FRIENDS)}
        />
    );
}

MyPageFriendMenu.displayName = 'MyPageFriendMenu';

export default MyPageFriendMenu;
