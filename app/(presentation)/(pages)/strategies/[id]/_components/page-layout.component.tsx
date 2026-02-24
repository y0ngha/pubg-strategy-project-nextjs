import { ReactNode } from 'react';

interface PageLayoutProps {
    content: ReactNode;
}

function PageLayout({ content }: PageLayoutProps) {
    return <div className={'flex h-screen w-full flex-col'}>{content}</div>;
}

export default PageLayout;
