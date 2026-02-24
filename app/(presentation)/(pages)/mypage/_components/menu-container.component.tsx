import { ReactNode } from 'react';

function MenuContainer({ children }: { children: ReactNode }) {
    return <div className={'grid gap-4'}>{children}</div>;
}

MenuContainer.displayName = 'MenuContainer';

export default MenuContainer;
