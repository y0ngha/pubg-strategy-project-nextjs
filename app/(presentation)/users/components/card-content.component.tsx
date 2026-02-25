import Card from '@/(presentation)/shared/components/card.component';
import { ReactNode } from 'react';

function CardContent({ children }: { children: ReactNode }) {
    return (
        <Card.Content
            className={'flex h-24 w-full items-center justify-between p-6 pt-6'}
        >
            {children}
        </Card.Content>
    );
}

CardContent.displayName = 'CardContent';

export default CardContent;
