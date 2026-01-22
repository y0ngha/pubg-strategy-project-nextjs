'use client';

import Button from '@/(presentation)/shared/components/button.component';
import Google from '@/(presentation)/shared/icons/google.icon';

function SocialLogin() {
    return (
        <div className={'flex w-full flex-row gap-4'}>
            <Button variant={'outline'} className={'flex-1'}>
                <Google width={18} height={18} />
                &nbsp;구글로 계속하기
            </Button>
        </div>
    );
}

SocialLogin.displayName = 'SocialLogin';

export default SocialLogin;
