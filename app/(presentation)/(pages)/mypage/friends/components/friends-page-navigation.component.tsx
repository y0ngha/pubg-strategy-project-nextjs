'use client';

import { Route } from '@/(presentation)/shared/constants/route';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

function FriendsPageNavigation() {
    const router = useRouter();

    return (
        <div className={'mb-6 flex items-center'}>
            <button
                onClick={() => router.push(Route.MYPAGE)}
                className={
                    'flex cursor-pointer items-center text-gray-500 transition-colors hover:text-blue-600'
                }
            >
                <ArrowLeft className={'mr-2 h-5 w-5'} />
                <span className={'font-medium'}>마이페이지로 돌아가기</span>
            </button>
        </div>
    );
}

FriendsPageNavigation.displayName = 'FriendsPageNavigation';

export default FriendsPageNavigation;
