import { ReactNode } from 'react';

function MyPageHeader({ children }: { children: ReactNode }) {
    return <h1 className={'mb-8 text-3xl font-bold'}>{children}</h1>;
}

MyPageHeader.displayName = 'MyPageHeader';

export default MyPageHeader;
