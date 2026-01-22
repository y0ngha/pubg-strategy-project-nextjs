import Image from 'next/image';

function RegisterIntroduce() {
    return (
        <div className={'relative h-full w-full'}>
            <Image
                src={'/images/register-bg.webp'}
                alt={'Register Background'}
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
                        &#34;𝑷𝑹𝑬𝑷𝑨𝑹𝑬 𝑭𝑶𝑹 𝑫𝑹𝑶𝑷&#34;
                    </span>
                </div>

                <div
                    className={
                        'mt-8 flex flex-col text-lg font-light opacity-90'
                    }
                >
                    <span className={'text-left'}>
                        최고의 플레이를 위한 분석,
                    </span>
                    <span className={'text-left'}>여기서부터 시작됩니다.</span>
                </div>
            </div>
        </div>
    );
}

RegisterIntroduce.displayName = 'RegisterIntroduce(Left View)';

export default RegisterIntroduce;
