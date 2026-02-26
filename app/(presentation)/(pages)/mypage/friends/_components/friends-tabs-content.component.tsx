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
} from '@/(presentation)/friends/hooks/useFriendsPageTab';
import { Check, X } from 'lucide-react';
import { useFriendActions } from '@/(presentation)/friends/hooks/useFriendActions';

type FriendAction = (id: string, currentStatus: string) => void;

type FriendType =
    | typeof MY_FIRENDS_TAB
    | typeof RECEIVED_FRIEND_REQUESTS_TAB
    | typeof SEND_FRIEND_REQUESTS_TAB;

interface FriendsTabsContentProps {
    activeTab: string;
    friends: GetFriendResponseDto[];
    receivedFriendRequests: GetFriendResponseDto[];
    sentFriendRequests: GetFriendResponseDto[];
}

function FriendsTabsContent({
    activeTab,
    friends,
    receivedFriendRequests,
    sentFriendRequests,
}: FriendsTabsContentProps) {
    const { accept, remove, reject, cancel } = useFriendActions();

    return (
        <div className={'space-y-3 overflow-y-auto'}>
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

interface FriendListItemContentProps {
    data: GetFriendResponseDto[];
    type: FriendType;
    onPrimaryButtonClick?: FriendAction;
    onSecondaryButtonClick?: FriendAction;
    emptyText: string;
}

function FriendListItemContent({
    data,
    type,
    onPrimaryButtonClick,
    onSecondaryButtonClick,
    emptyText,
}: FriendListItemContentProps) {
    if (data.length === 0) {
        return <p className={'py-10 text-center text-gray-500'}>{emptyText}</p>;
    }

    return data.map(friend => (
        <FriendListItem
            key={friend.id}
            friend={friend}
            type={type}
            onPrimaryButtonClick={onPrimaryButtonClick}
            onSecondaryButtonClick={onSecondaryButtonClick}
        />
    ));
}

function MyFriends({
    friends,
    onDeleteFriend,
}: { onDeleteFriend: FriendAction } & Pick<
    FriendsTabsContentProps,
    'friends'
>) {
    return (
        <FriendListItemContent
            data={friends}
            type={MY_FIRENDS_TAB}
            onSecondaryButtonClick={onDeleteFriend}
            emptyText={'등록된 친구가 없습니다.'}
        />
    );
}

function ReceivedFriendRequests({
    receivedFriendRequests,
    onAcceptFriend,
    onRejectFriend,
}: { onAcceptFriend: FriendAction; onRejectFriend: FriendAction } & Pick<
    FriendsTabsContentProps,
    'receivedFriendRequests'
>) {
    return (
        <FriendListItemContent
            data={receivedFriendRequests}
            type={RECEIVED_FRIEND_REQUESTS_TAB}
            onPrimaryButtonClick={onAcceptFriend}
            onSecondaryButtonClick={onRejectFriend}
            emptyText={'받은 친구 요청이 없습니다.'}
        />
    );
}

function SentFriendRequests({
    sentFriendRequests,
    onCancelFriendRequest,
}: { onCancelFriendRequest: FriendAction } & Pick<
    FriendsTabsContentProps,
    'sentFriendRequests'
>) {
    return (
        <FriendListItemContent
            data={sentFriendRequests}
            type={SEND_FRIEND_REQUESTS_TAB}
            onSecondaryButtonClick={onCancelFriendRequest}
            emptyText={'보낸 친구 요청이 없습니다.'}
        />
    );
}

interface FriendListItemActionsProps {
    type: FriendType;
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
        <div className={'flex gap-4'}>
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
        </div>
    );
}

interface FriendListItemProps {
    friend: GetFriendResponseDto;
    type: FriendType;
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
FriendsTabsContent.displayName = 'FriendsTabsContent';

export default FriendsTabsContent;
