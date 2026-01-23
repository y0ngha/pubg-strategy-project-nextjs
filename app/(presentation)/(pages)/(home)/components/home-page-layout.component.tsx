import { ReactNode } from 'react';

interface HomePageLayoutProps {
    hero: ReactNode;
    main: ReactNode;
}

function HomePageLayout({ hero, main }: HomePageLayoutProps) {
    return (
        <>
            <div className={'flex flex-col'}>
                <div className={'h-[500] w-full'}>{hero}</div>
                <div className={'flex flex-row gap-12 p-5'}>{main}</div>
            </div>
        </>
    );
}

HomePageLayout.displayName = 'HomePageLayout';

export default HomePageLayout;
