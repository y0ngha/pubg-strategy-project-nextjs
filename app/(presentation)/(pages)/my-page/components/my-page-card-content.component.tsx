import Card from '@/(presentation)/shared/components/card.component';
import { ReactNode } from 'react';

function MyPageCardContent({ children }: { children: ReactNode }) {
    return (
        <Card.Content
            className={'flex h-24 w-full items-center justify-between p-6 pt-6'}
        >
            {children}
        </Card.Content>
    );
}

MyPageCardContent.displayName = 'MyPageCardContent';

export default MyPageCardContent;
