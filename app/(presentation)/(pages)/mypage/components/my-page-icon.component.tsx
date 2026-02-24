import { ReactNode } from 'react';

function MyPageIcon({ children }: { children: ReactNode }) {
    return <div className={'rounded-full bg-gray-800 p-3'}>{children}</div>;
}

MyPageIcon.displayName = 'MyPageIcon';

export default MyPageIcon;
