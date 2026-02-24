'use client';

import { Users } from 'lucide-react';
import { Route } from '@/(presentation)/shared/constants/route';
import { useRouter } from 'next/navigation';
import MenuCard from '@/(presentation)/(pages)/mypage/_components/menu-card.component';
import { useFriendSummary } from '@/(presentation)/friends/hooks/useFriendSummary';

function FriendMenu() {
    const { description, isPending } = useFriendSummary();
    const router = useRouter();

    return (
        <MenuCard
            icon={<Users className={'text-blue-600'} />}
            title={'친구 관리'}
            description={description}
            isPending={isPending}
            handleClick={() => router.push(Route.FRIENDS)}
        />
    );
}

FriendMenu.displayName = 'FriendMenu';

export default FriendMenu;
