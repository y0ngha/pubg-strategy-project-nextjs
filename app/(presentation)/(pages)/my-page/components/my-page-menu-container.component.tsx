import { ReactNode } from 'react';

function MyPageMenuContainer({ children }: { children: ReactNode }) {
    return <div className={'grid gap-4'}>{children}</div>;
}

MyPageMenuContainer.displayName = 'MyPageMenuContainer';

export default MyPageMenuContainer;
