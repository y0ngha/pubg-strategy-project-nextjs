'use client';

import UserAvatar from '@/(presentation)/shared/components/user-avatar.component';
import Card from '@/(presentation)/shared/components/card.component';
import { Mail } from 'lucide-react';
import MyPageIcon from '@/(presentation)/(pages)/mypage/components/my-page-icon.component';
import { useGetCurrentUser } from '@/(presentation)/shared/hooks/useGetCurrentUser';
import Skeleton from '@/(presentation)/shared/components/skeleton.component';
import MyPageCardContent from '@/(presentation)/(pages)/mypage/components/my-page-card-content.component';

function MyPageProfile() {
    const { data, isPending } = useGetCurrentUser();

    return (
        <Card>
            <MyPageCardContent>
                {isPending && <Skeleton />}
                {!isPending && data !== undefined && (
                    <div className={'flex items-center gap-4'}>
                        <MyPageIcon>
                            <UserAvatar />
                        </MyPageIcon>
                        <div>
                            <h2
                                className={
                                    'flex items-center gap-2 text-xl font-bold'
                                }
                            >
                                <Mail />
                                <span>{data?.email}</span>
                            </h2>
                        </div>
                    </div>
                )}
            </MyPageCardContent>
        </Card>
    );
}

MyPageProfile.displayName = 'MyPageProfile';

export default MyPageProfile;
