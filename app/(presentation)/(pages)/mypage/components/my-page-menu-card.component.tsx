'use client';

import Card from '@/(presentation)/shared/components/card.component';
import { ReactNode } from 'react';
import { ChevronRight } from 'lucide-react';
import MyPageIcon from '@/(presentation)/(pages)/mypage/components/my-page-icon.component';
import MyPageCardContent from '@/(presentation)/(pages)/mypage/components/my-page-card-content.component';
import Skeleton from '@/(presentation)/shared/components/skeleton.component';

interface MenuCardProps {
    icon: ReactNode;
    title: string;
    description: string;
    isPending?: boolean;
    handleClick: () => void;
}

function MyPageMenuCard({
    icon,
    title,
    description,
    isPending,
    handleClick,
}: MenuCardProps) {
    if (isPending) {
        return (
            <Card>
                <MyPageCardContent>
                    <Skeleton />
                </MyPageCardContent>
            </Card>
        );
    }

    return (
        <Card
            onClick={handleClick}
            className={
                'group hover:border-primary cursor-pointer transition-all hover:shadow-md'
            }
        >
            <MyPageCardContent>
                <div className={'flex items-center gap-4'}>
                    <MyPageIcon>{icon}</MyPageIcon>
                    <div>
                        <h3
                            className={
                                'group-hover:text-primary-hover text-lg font-semibold transition-colors'
                            }
                        >
                            {title}
                        </h3>
                        <p className={'text-sm text-gray-500'}>{description}</p>
                    </div>
                </div>
                <ChevronRight
                    className={
                        'group-hover:text-primary-hover h-5 w-5 text-gray-400'
                    }
                />
            </MyPageCardContent>
        </Card>
    );
}

MyPageMenuCard.displayName = 'MyPageMenuCard';

export default MyPageMenuCard;
