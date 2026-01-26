import * as React from 'react';
import { ReactNode } from 'react';
import Button from '@/(presentation)/shared/components/button.component';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { Route } from '@/(presentation)/shared/constants/route';

interface StrategiesHeaderLayoutProps {
    header: ReactNode;
    buttons: ReactNode;
}

export function StrategiesHeaderLayout({
    header,
    buttons,
}: StrategiesHeaderLayoutProps) {
    return (
        <div
            className={
                'flex flex-col justify-between gap-4 md:flex-row md:items-center'
            }
        >
            {header}
            {buttons}
        </div>
    );
}

export function StrategiesHeader() {
    return (
        <div>
            <h1 className={'text-3xl font-bold tracking-tight'}>나의 작전실</h1>
            <h2 className={'text-muted-foreground mt-1'}>
                전술을 수립하고, 데이터를 분석하여 치킨을 쟁취하세요.
            </h2>
        </div>
    );
}

export function StrategiyCreateButton() {
    return (
        <Link href={Route.STRATEGIES_NEW}>
            <Button className="shadow-primary/20 gap-2 shadow-lg">
                <Plus className="h-4 w-4" /> 새 작전 수립
            </Button>
        </Link>
    );
}

StrategiesHeaderLayout.displayName = 'StrategiesHeaderLayout';
StrategiesHeader.displayName = 'StrategiesHeader';
StrategiyCreateButton.displayName = 'StrategiyCreateButton';
