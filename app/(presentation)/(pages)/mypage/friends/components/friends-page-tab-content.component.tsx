'use client';

import Card from '@/(presentation)/shared/components/card.component';
import UserAvatar from '@/(presentation)/shared/components/user-avatar.component';
import Button from '@/(presentation)/shared/components/button.component';
import { GetFriendResponseDto } from '@/application/friend/dto/get-friend-list.dto';
import Switch from '@/(presentation)/shared/components/switch-case.component';
import {
    MY_FIRENDS_TAB,
    RECEIVED_FRIEND_REQUESTS_TAB,
    SEND_FRIEND_REQUESTS_TAB,
} from '@/(presentation)/(pages)/mypage/friends/hooks/useFriendsPageTab';
import { Check, X } from 'lucide-react';
import { useFriendActions } from '@/(presentation)/(pages)/mypage/friends/hooks/useFriendActions';

type FriendAction = (id: string, currentStatus: string) => void;

interface FriendsPageTabContentProps {
    activeTab: string;
    friends: GetFriendResponseDto[];
    receivedFriendRequests: GetFriendResponseDto[];
    sentFriendRequests: GetFriendResponseDto[];
}

function FriendsPageTabContent({
    activeTab,
    friends,
    receivedFriendRequests,
    sentFriendRequests,
}: FriendsPageTabContentProps) {
    const { accept, remove, reject, cancel } = useFriendActions();

    return (
        <div className={'space-y-3'}>
            <Switch value={activeTab}>
                <Switch.Case value={MY_FIRENDS_TAB}>
                    <MyFriends friends={friends} onDeleteFriend={remove} />
                </Switch.Case>
                <Switch.Case value={RECEIVED_FRIEND_REQUESTS_TAB}>
                    <ReceivedFriendRequests
                        receivedFriendRequests={receivedFriendRequests}
                        onAcceptFriend={accept}
                        onRejectFriend={reject}
                    />
                </Switch.Case>
                <Switch.Case value={SEND_FRIEND_REQUESTS_TAB}>
                    <SentFriendRequests
                        sentFriendRequests={sentFriendRequests}
                        onCancelFriendRequest={cancel}
                    />
                </Switch.Case>
            </Switch>
        </div>
    );
}

function MyFriends({
    friends,
    onDeleteFriend,
}: { onDeleteFriend: FriendAction } & Pick<
    FriendsPageTabContentProps,
    'friends'
>) {
    if (friends.length === 0) {
        return (
            <p className={'py-10 text-center text-gray-500'}>
                등록된 친구가 없습니다.
            </p>
        );
    }

    return friends.map(friend => (
        <FriendListItem
            key={friend.id}
            friend={friend}
            type={MY_FIRENDS_TAB}
            onSecondaryButtonClick={onDeleteFriend}
        />
    ));
}

function ReceivedFriendRequests({
    receivedFriendRequests,
    onAcceptFriend,
    onRejectFriend,
}: { onAcceptFriend: FriendAction; onRejectFriend: FriendAction } & Pick<
    FriendsPageTabContentProps,
    'receivedFriendRequests'
>) {
    if (receivedFriendRequests.length === 0) {
        return (
            <p className={'py-10 text-center text-gray-500'}>
                받은 친구 요청이 없습니다.
            </p>
        );
    }

    return receivedFriendRequests.map(friend => (
        <FriendListItem
            key={friend.id}
            friend={friend}
            type={RECEIVED_FRIEND_REQUESTS_TAB}
            onPrimaryButtonClick={onAcceptFriend}
            onSecondaryButtonClick={onRejectFriend}
        />
    ));
}

function SentFriendRequests({
    sentFriendRequests,
    onCancelFriendRequest,
}: { onCancelFriendRequest: FriendAction } & Pick<
    FriendsPageTabContentProps,
    'sentFriendRequests'
>) {
    if (sentFriendRequests.length === 0) {
        return (
            <p className={'py-10 text-center text-gray-500'}>
                보낸 친구 요청이 없습니다.
            </p>
        );
    }

    return sentFriendRequests.map(friend => (
        <FriendListItem
            key={friend.id}
            friend={friend}
            type={SEND_FRIEND_REQUESTS_TAB}
            onSecondaryButtonClick={onCancelFriendRequest}
        />
    ));
}

interface FriendListItemActionsProps {
    type:
        | typeof MY_FIRENDS_TAB
        | typeof RECEIVED_FRIEND_REQUESTS_TAB
        | typeof SEND_FRIEND_REQUESTS_TAB;
    id: string;
    currentStatus: string;
    onPrimaryButtonClick?: FriendAction;
    onSecondaryButtonClick?: FriendAction;
}

function FriendListItemActions({
    type,
    id,
    currentStatus,
    onPrimaryButtonClick,
    onSecondaryButtonClick,
}: FriendListItemActionsProps) {
    const actionMap = {
        [MY_FIRENDS_TAB]: {
            secondary: {
                label: '삭제',
                onClick: () => onSecondaryButtonClick?.(id, currentStatus),
            },
            primary: null,
        },
        [RECEIVED_FRIEND_REQUESTS_TAB]: {
            secondary: {
                label: <X />,
                onClick: () => onSecondaryButtonClick?.(id, currentStatus),
            },
            primary: {
                label: <Check />,
                onClick: () => onPrimaryButtonClick?.(id, currentStatus),
            },
        },
        [SEND_FRIEND_REQUESTS_TAB]: {
            secondary: {
                label: '취소',
                onClick: () => onSecondaryButtonClick?.(id, currentStatus),
            },
            primary: null,
        },
    };

    const currentAction = actionMap[type];

    return (
        <>
            {currentAction.secondary && (
                <Button
                    variant={'secondary'}
                    onClick={currentAction.secondary.onClick}
                >
                    {currentAction.secondary.label}
                </Button>
            )}
            {currentAction.primary && (
                <Button
                    variant={'primary'}
                    onClick={currentAction.primary.onClick}
                >
                    {currentAction.primary.label}
                </Button>
            )}
        </>
    );
}

interface FriendListItemProps {
    friend: GetFriendResponseDto;
    type:
        | typeof MY_FIRENDS_TAB
        | typeof RECEIVED_FRIEND_REQUESTS_TAB
        | typeof SEND_FRIEND_REQUESTS_TAB;
    onPrimaryButtonClick?: FriendAction;
    onSecondaryButtonClick?: FriendAction;
}

function FriendListItem({
    friend,
    type,
    onPrimaryButtonClick,
    onSecondaryButtonClick,
}: FriendListItemProps) {
    return (
        <Card>
            <Card.Content
                className={'flex items-center justify-between p-4 pt-4'}
            >
                <div className={'flex items-center gap-4'}>
                    <UserAvatar className={'w-6'} />
                    <div>
                        <div
                            className={
                                'font-semibold text-gray-900 dark:text-gray-100'
                            }
                        >
                            {friend.displayEmail}
                        </div>
                    </div>
                </div>

                <FriendListItemActions
                    type={type}
                    id={friend.id}
                    currentStatus={friend.status}
                    onPrimaryButtonClick={onPrimaryButtonClick}
                    onSecondaryButtonClick={onSecondaryButtonClick}
                />
            </Card.Content>
        </Card>
    );
}

FriendListItem.displayName = 'FriendListItem';
FriendsPageTabContent.displayName = 'FriendsPageTabContent';

export default FriendsPageTabContent;
