import { ReactNode } from 'react';

interface StrategyPageLayoutProps {
    content: ReactNode;
    footer: ReactNode;
}

function StrategyPageLayout({ content, footer }: StrategyPageLayoutProps) {
    return (
        <div className={'flex h-screen w-full flex-col'}>
            {content}
            {footer}
        </div>
    );
}

export default StrategyPageLayout;
