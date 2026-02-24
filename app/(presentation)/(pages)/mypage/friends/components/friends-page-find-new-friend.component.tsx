'use client';

import Card from '@/(presentation)/shared/components/card.component';
import Input from '@/(presentation)/shared/components/input.component';
import Button from '@/(presentation)/shared/components/button.component';
import { Search } from 'lucide-react';
import { useRequestFriendMutation } from '@/(presentation)/(pages)/mypage/friends/hooks/useRequestFriendMutation';
import { SubmitHandler, useForm } from 'react-hook-form';

interface FriendRequestInputs {
    email: string;
}

function FriendsPageFindNewFriend() {
    const { register, handleSubmit, reset } = useForm<FriendRequestInputs>();
    const { requestFriend } = useRequestFriendMutation();

    const onSubmit: SubmitHandler<FriendRequestInputs> = data => {
        const formData = new FormData();

        formData.set('email', data.email);

        requestFriend(formData, {
            onSettled: () => {
                reset();
            },
        });
    };

    return (
        <Card>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Card.Content className={'flex items-end gap-2 p-6 pt-6'}>
                    <div className={'flex-1'}>
                        <Input
                            {...register('email')}
                            type={'email'}
                            label={'새로운 친구 찾기'}
                            placeholder={'이메일 검색'}
                        />
                    </div>
                    <Button
                        type={'submit'}
                        variant={'primary'}
                        className={'mt-0.5 mb-0.5'}
                    >
                        <Search className={'mr-2 h-4 w-4'} />
                        친구 추가
                    </Button>
                </Card.Content>
            </form>
        </Card>
    );
}

FriendsPageFindNewFriend.displayName = 'FriendsPageFindNewFriend';

export default FriendsPageFindNewFriend;
