'use client';

import { Lock } from 'lucide-react';
import { usePasswordChangeModal } from '@/(presentation)/auth/hooks/usePasswordChangeModal';
import MenuCard from '@/(presentation)/(pages)/mypage/_components/menu-card.component';

function PasswordChangeMenu() {
    const { PasswordChangeModal, openPasswordModal } = usePasswordChangeModal();

    return (
        <>
            <MenuCard
                icon={<Lock className={'text-orange-600'} />}
                title={'비밀번호 변경'}
                description={'계정 보안 및 로그인 설정'}
                handleClick={openPasswordModal}
            />

            <PasswordChangeModal />
        </>
    );
}

PasswordChangeMenu.displayName = 'PasswordChangeMenu';

export default PasswordChangeMenu;
