import { ReactNode } from 'react';

interface HomePageLayoutProps {
    hero: ReactNode;
    main: ReactNode;
}

function HomePageLayout({ hero, main }: HomePageLayoutProps) {
    return (
        <>
            <div className={'flex min-h-screen flex-col'}>
                <div className={'h-[500] w-full'}>{hero}</div>
                <div className={'flex h-[750] flex-row gap-12 p-5'}>{main}</div>
            </div>
        </>
    );
}

HomePageLayout.displayName = 'HomePageLayout';

export default HomePageLayout;
