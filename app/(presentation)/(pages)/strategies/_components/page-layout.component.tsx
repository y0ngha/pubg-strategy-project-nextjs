import { ReactNode } from 'react';

interface PageLayoutProps {
    headerLayout: ReactNode;
    tabs: ReactNode;
    content: ReactNode;
}
function PageLayout({ headerLayout, tabs, content }: PageLayoutProps) {
    return (
        <div className={'flex h-full w-full flex-col space-y-4 p-6'}>
            {headerLayout}
            {tabs}
            {content}
        </div>
    );
}

PageLayout.displayName = 'PageLayout';

export default PageLayout;
