import { ReactNode } from 'react';

function Header({ children }: { children: ReactNode }) {
    return <h1 className={'mb-8 text-3xl font-bold'}>{children}</h1>;
}

Header.displayName = 'Header';

export default Header;
