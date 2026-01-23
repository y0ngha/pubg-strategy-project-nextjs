'use client';

import { useEffect } from 'react';
import Button from '@/(presentation)/shared/components/button.component';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div className="flex h-full w-full flex-col items-center justify-center gap-4">
            <h1 className={'text-3xl font-black'}>Error</h1>
            <h2 className={'text-xl font-bold'}>문제가 발생했습니다!</h2>

            <p className="text-red-500">{error.message}</p>

            <Button type={'button'} variant={'ghost'} onClick={() => reset()}>
                다시 시도
            </Button>
        </div>
    );
}
