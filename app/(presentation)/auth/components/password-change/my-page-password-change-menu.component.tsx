'use client';

import { Lock } from 'lucide-react';
import MyPageMenuCard from '@/(presentation)/(pages)/mypage/_components/my-page-menu-card.component';
import { usePasswordChangeModal } from '@/(presentation)/auth/hooks/usePasswordChangeModal';

function MyPagePasswordChangeMenu() {
    const { PasswordChangeModal, openPasswordModal } = usePasswordChangeModal();

    return (
        <>
            <MyPageMenuCard
                icon={<Lock className={'text-orange-600'} />}
                title={'비밀번호 변경'}
                description={'계정 보안 및 로그인 설정'}
                handleClick={openPasswordModal}
            />

            <PasswordChangeModal />
        </>
    );
}

MyPagePasswordChangeMenu.displayName = 'MyPagePasswordChangeMenu';

export default MyPagePasswordChangeMenu;
