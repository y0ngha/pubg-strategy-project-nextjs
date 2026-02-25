import { ReactNode } from 'react';

function UserIconWrapper({ children }: { children: ReactNode }) {
    return <div className={'rounded-full bg-gray-800 p-3'}>{children}</div>;
}

UserIconWrapper.displayName = 'UserIconWrapper';

export default UserIconWrapper;
