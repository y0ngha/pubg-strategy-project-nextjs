import { ReactNode } from 'react';

interface HeaderLayoutProps {
    header: ReactNode;
    strategyCreate: ReactNode;
}

function HeaderLayout({ header, strategyCreate }: HeaderLayoutProps) {
    return (
        <div
            className={
                'flex flex-col justify-between gap-4 md:flex-row md:items-center'
            }
        >
            {header}
            {strategyCreate}
        </div>
    );
}

HeaderLayout.displayName = 'HeaderLayout';

export default HeaderLayout;
