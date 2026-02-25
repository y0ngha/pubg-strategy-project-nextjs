import FriendsDehydrate from '@/(presentation)/dehydrates/friends-dehydrate.component';
import Header from '@/(presentation)/(pages)/mypage/_components/header.component';
import MenuContainer from '@/(presentation)/(pages)/mypage/_components/menu-container.component';
import Profile from '@/(presentation)/users/components/profile.component';
import FriendMenu from '@/(presentation)/(pages)/mypage/_components/friend-menu.component';
import PasswordChangeMenu from '@/(presentation)/auth/components/password-change/password-change-menu.component';

export default function MyPage() {
    return (
        <FriendsDehydrate>
            <div className={'mx-auto h-screen max-w-2xl space-y-6 px-4 py-10'}>
                <Header>내 정보 관리</Header>

                <Profile />

                <MenuContainer>
                    <FriendMenu />
                    <PasswordChangeMenu />
                </MenuContainer>
            </div>
        </FriendsDehydrate>
    );
}
