import { ReactNode } from 'react';

function FriendsPageHeader({ children }: { children: ReactNode }) {
    return <h1 className={'mb-8 text-3xl font-bold'}>{children}</h1>;
}

FriendsPageHeader.displayName = 'FriendsPageHeader';

export default FriendsPageHeader;
