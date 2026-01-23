import Link from 'next/link';
import { Route } from '@/(presentation)/shared/constants/route';

function Login() {
    return (
        <div className={'flex w-full flex-row gap-2'}>
            <span className={'opacity-70'}>이미 계정이 있으신가요?</span>
            <Link href={Route.LOGIN} className={'opacity-70 hover:opacity-100'}>
                [로그인]
            </Link>
        </div>
    );
}

Login.displayName = 'Login';

export default Login;
