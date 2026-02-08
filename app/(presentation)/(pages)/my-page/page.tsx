import MyPageHeader from '@/(presentation)/(pages)/my-page/components/my-page-header.component';
import MyPageProfile from '@/(presentation)/(pages)/my-page/components/my-page-profile.component';
import MyPageMenuContainer from '@/(presentation)/(pages)/my-page/components/my-page-menu-container.component';
import FriendsDehydrate from '@/(presentation)/dehydrate-components/friends-dehydrate.component';
import MyPageFriendMenu from '@/(presentation)/(pages)/my-page/components/my-page-friend-menu.component';
import MyPagePasswordChangeMenu from '@/(presentation)/(pages)/my-page/components/my-page-password-change-menu.component';

export default function MyPage() {
    return (
        <FriendsDehydrate>
            <div className={'mx-auto max-w-2xl space-y-6 px-4 py-10'}>
                <MyPageHeader>내 정보 관리</MyPageHeader>

                <MyPageProfile />

                <MyPageMenuContainer>
                    <MyPageFriendMenu />
                    <MyPagePasswordChangeMenu />
                </MyPageMenuContainer>
            </div>
        </FriendsDehydrate>
    );
}
