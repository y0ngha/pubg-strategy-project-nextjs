import { ReactNode } from 'react';

interface PageLayoutProps {
    hero: ReactNode;
    main: ReactNode;
}

function PageLayout({ hero, main }: PageLayoutProps) {
    return (
        <>
            <div className={'flex min-h-screen flex-col'}>
                <div className={'h-[500] w-full'}>{hero}</div>
                <div className={'flex h-[750] flex-row gap-12 p-5'}>{main}</div>
            </div>
        </>
    );
}

PageLayout.displayName = 'PageLayout';

export default PageLayout;
