'use client';

import UserAvatar from '@/(presentation)/shared/components/user-avatar.component';
import Card from '@/(presentation)/shared/components/card.component';
import { Mail } from 'lucide-react';
import { useGetCurrentUser } from '@/(presentation)/users/hooks/queries/useGetCurrentUser';
import Skeleton from '@/(presentation)/shared/components/skeleton.component';
import UserIconWrapper from '@/(presentation)/users/components/user-icon-wrapper.component';
import CardContent from '@/(presentation)/users/components/card-content.component';

function Profile() {
    const { data, isPending } = useGetCurrentUser();

    return (
        <Card>
            <CardContent>
                {isPending && <Skeleton />}
                {!isPending && data !== undefined && (
                    <div className={'flex items-center gap-4'}>
                        <UserIconWrapper>
                            <UserAvatar />
                        </UserIconWrapper>
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
            </CardContent>
        </Card>
    );
}

Profile.displayName = 'Profile';

export default Profile;
