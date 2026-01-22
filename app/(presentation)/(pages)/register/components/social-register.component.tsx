'use client';

import Button from '@/(presentation)/shared/components/button.component';
import Google from '@/(presentation)/shared/icons/google.icon';

function SocialRegister() {
    return (
        <div className={'flex w-full flex-row gap-4'}>
            <Button variant={'outline'} className={'flex-1 gap-2'}>
                <Google width={18} height={18} />
                구글로 가입하기
            </Button>
        </div>
    );
}

SocialRegister.displayName = 'SocialRegister';

export default SocialRegister;
