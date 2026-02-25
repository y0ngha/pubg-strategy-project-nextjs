import Link from 'next/link';
import { Routes } from '@/(presentation)/shared/constants/routes';

function Logo() {
    return (
        <Link href={Routes.MAIN} className={'flex items-center gap-2'}>
            <span
                className={
                    'hidden text-xl font-black tracking-tighter italic sm:inline-block'
                }
            >
                PUBG<span className={'text-primary'}>.OP</span>
            </span>
        </Link>
    );
}

Logo.displayName = 'Logo';

export default Logo;
