'use client';

import { Lock } from 'lucide-react';
import MyPageMenuCard from '@/(presentation)/(pages)/my-page/components/my-page-menu-card.component';

function MyPagePasswordChangeMenu() {
    return (
        <MyPageMenuCard
            icon={<Lock className={'text-orange-600'} />}
            title={'비밀번호 변경'}
            description={'계정 보안 및 로그인 설정'}
            handleClick={() => {}}
        />
    );
}

MyPagePasswordChangeMenu.displayName = 'MyPagePasswordChangeMenu';

export default MyPagePasswordChangeMenu;
