'use client';

import { useEffect } from 'react';

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
        <div className="flex flex-col items-center justify-center">
            <h2>문제가 발생했습니다!</h2>

            <p className="text-red-500">{error.message}</p>

            <button onClick={() => reset()}>다시 시도</button>
        </div>
    );
}
