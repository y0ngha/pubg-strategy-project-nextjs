import FriendsPageNavigation from '@/(presentation)/(pages)/mypage/friends/components/friends-page-navigation.component';
import FriendsPageHeader from '@/(presentation)/(pages)/mypage/friends/components/friends-page-header.component';
import FriendsPageFindNewFriend from '@/(presentation)/(pages)/mypage/friends/components/friends-page-find-new-friend.component';
import FriendsPageBody from '@/(presentation)/(pages)/mypage/friends/components/friends-page-body.component';

export default function FriendsPage() {
    return (
        <div className={'mx-auto h-screen max-w-3xl space-y-6 px-4 py-10'}>
            <FriendsPageNavigation />
            <FriendsPageHeader>친구 관리</FriendsPageHeader>
            <FriendsPageFindNewFriend />
            <FriendsPageBody />
        </div>
    );
}
