'use client';

import Card from '@/(presentation)/shared/components/card.component';
import { ReactNode } from 'react';
import { ChevronRight } from 'lucide-react';
import Skeleton from '@/(presentation)/shared/components/skeleton.component';
import CardContent from '@/(presentation)/users/components/card-content.component';
import UserIconWrapper from '@/(presentation)/users/components/user-icon-wrapper.component';

interface MenuCardProps {
    icon: ReactNode;
    title: string;
    description: string;
    isPending?: boolean;
    handleClick: () => void;
}

function MenuCard({
    icon,
    title,
    description,
    isPending,
    handleClick,
}: MenuCardProps) {
    if (isPending) {
        return (
            <Card>
                <CardContent>
                    <Skeleton />
                </CardContent>
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
            <CardContent>
                <div className={'flex items-center gap-4'}>
                    <UserIconWrapper>{icon}</UserIconWrapper>
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
            </CardContent>
        </Card>
    );
}

MenuCard.displayName = 'MenuCard';

export default MenuCard;
