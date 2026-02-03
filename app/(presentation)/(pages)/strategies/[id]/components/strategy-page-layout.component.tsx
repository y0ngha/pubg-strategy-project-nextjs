import { ReactNode } from 'react';

interface StrategyPageLayoutProps {
    content: ReactNode;
}

function StrategyPageLayout({ content }: StrategyPageLayoutProps) {
    return <div className={'flex h-screen w-full flex-col'}>{content}</div>;
}

export default StrategyPageLayout;
