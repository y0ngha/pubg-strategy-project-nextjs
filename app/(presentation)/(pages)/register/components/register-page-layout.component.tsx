import { ReactNode } from 'react';

function RegisterPageLayout({
    introduce,
    form,
}: {
    introduce: ReactNode;
    form: ReactNode;
}) {
    return (
        <div className={'flex h-full w-full flex-row'}>
            <div
                className={
                    'relative flex h-full flex-1 flex-col items-center justify-center'
                }
            >
                {introduce}
            </div>
            <div
                className={
                    'bg-background flex min-w-0 flex-1 flex-col items-center justify-center'
                }
            >
                <div className={'w-full space-y-4 px-8 sm:px-12'}>{form}</div>
            </div>
        </div>
    );
}

RegisterPageLayout.displayName = 'RegisterPageLayout';

export default RegisterPageLayout;
