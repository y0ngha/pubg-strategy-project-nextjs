import Image from 'next/image';
import Button from '@/(presentation)/shared/components/button.component';
import Google from '@/(presentation)/shared/icons/google.icon';
import Input from '@/(presentation)/shared/components/input.component';
import Link from 'next/link';

export default function Login() {
    return (
        <div className={'flex h-full w-full flex-row'}>
            <div
                className={
                    'relative flex h-full flex-1 flex-col items-center justify-center'
                }
            >
                <Image
                    src="/images/login-bg.webp"
                    alt="Login Background"
                    className="object-cover opacity-50"
                    fill
                />

                <span className={'text-left'}>&#34;𝑾𝑰𝑵𝑵𝑬𝑹 𝑾𝑰𝑵𝑵𝑬𝑹</span>
                <span className={'text-right'}>𝑪𝑯𝑰𝑪𝑲𝑬𝑵 𝑫𝑰𝑵𝑵𝑬𝑹&#34;</span>
                <br />
                <br />
                <span className={'text-left'}>
                    데이터로 증명하는 나만의 전략
                </span>
                <span className={'text-left'}>지금 바로 시작하세요.</span>
            </div>
            <div
                className={
                    'bg-background flex min-w-0 flex-1 flex-col items-center justify-center'
                }
            >
                <div className="w-full space-y-4 px-8 sm:px-12">
                    <div className="text-center">
                        <h1 className="text-3xl font-bold">로그인</h1>
                    </div>

                    <Button variant={'outline'} className={'w-full'}>
                        <Google width={18} height={18} />
                        &nbsp;구글로 계속하기
                    </Button>

                    <span
                        className={
                            'inline-block w-full text-center font-normal'
                        }
                    >
                        또는 이메일로 계속하기
                    </span>

                    <Input type={'text'} label={'Email'} />
                    <Input type={'password'} label={'Password'} />
                    <Button type={'submit'} className={'w-full'}>
                        로그인
                    </Button>

                    <div className={'flex w-full flex-row gap-2'}>
                        <span className={'opacity-70'}>계정이 없으신가요?</span>
                        <Link
                            href="/register"
                            className={'opacity-70 hover:opacity-100'}
                        >
                            [회원가입]
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
