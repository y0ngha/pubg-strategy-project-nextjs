import Link from 'next/link';
import { Routes } from '@/(presentation)/shared/constants/routes';

function Register() {
    return (
        <div className={'flex w-full flex-row gap-2'}>
            <span className={'opacity-70'}>계정이 없으신가요?</span>
            <Link
                href={Routes.REGISTER}
                className={'opacity-70 hover:opacity-100'}
            >
                [회원가입]
            </Link>
        </div>
    );
}

Register.displayName = 'Register';

export default Register;
