import Header from '@/(presentation)/(pages)/mypage/friends/_components/header.component';
import Navigation from '@/(presentation)/(pages)/mypage/friends/_components/navigation.component';
import FindNewFriend from '@/(presentation)/friends/components/find-new-friend.component';
import Friends from '@/(presentation)/(pages)/mypage/friends/_components/friends.component';

export default function FriendsPage() {
    return (
        <div className={'mx-auto h-screen max-w-3xl space-y-6 px-4 py-10'}>
            <Navigation />
            <Header>친구 관리</Header>
            <FindNewFriend />
            <Friends />
        </div>
    );
}
