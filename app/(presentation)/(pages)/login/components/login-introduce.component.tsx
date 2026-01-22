import Image from 'next/image';

function LoginIntroduce() {
    return (
        <div className={'relative h-full w-full'}>
            <Image
                src={'/images/login-bg.webp'}
                alt={'Login Background'}
                className={'-z-10 object-cover opacity-50'}
                fill
                priority
            />

            <div
                className={
                    'relative z-10 flex h-full flex-col items-center justify-center gap-4 p-10 text-white'
                }
            >
                <div className={'flex flex-col gap-2'}>
                    <span
                        className={
                            'text-left text-3xl font-extrabold tracking-widest'
                        }
                    >
                        &#34;𝑾𝑰𝑵𝑵𝑬𝑹 𝑾𝑰𝑵𝑵𝑬𝑹
                    </span>
                    <span
                        className={
                            'text-right text-3xl font-extrabold tracking-widest'
                        }
                    >
                        𝑪𝑯𝑰𝑪𝑲𝑬𝑵 𝑫𝑰𝑵𝑵𝑬𝑹&#34;
                    </span>
                </div>

                <div
                    className={
                        't-8 flex flex-col text-lg font-light opacity-90'
                    }
                >
                    <span className={'text-left'}>
                        데이터로 증명하는 나만의 전략
                    </span>
                </div>
            </div>
        </div>
    );
}

LoginIntroduce.displayName = 'LoginIntroduce(Left View)';

export default LoginIntroduce;
