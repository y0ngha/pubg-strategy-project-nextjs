import { useRejectReceivedRequestMutation } from '@/(presentation)/friends/hooks/mutations/useRejectReceivedRequestMutation';
import { useDeleteFriendMutation } from '@/(presentation)/friends/hooks/mutations/useDeleteFriendMutation';
import { useCancelSentFriendRequestMutation } from '@/(presentation)/friends/hooks/mutations/useCancelSentFriendRequestMutation';
import { useAcceptReceivedRequestMutation } from '@/(presentation)/friends/hooks/mutations/useAcceptReceivedRequestMutation';

export function useFriendActions() {
    const { acceptReceivedFriendRequest } = useAcceptReceivedRequestMutation();
    const { rejectReceivedFriendRequest } = useRejectReceivedRequestMutation();
    const { cancelSentFriendRequest } = useCancelSentFriendRequestMutation();
    const { deleteFriend } = useDeleteFriendMutation();

    const accept = (id: string, currentStatus: string) => {
        const formData = new FormData();
        formData.set('id', id);
        formData.set('currentStatus', currentStatus);

        acceptReceivedFriendRequest(formData);
    };

    const reject = (id: string, currentStatus: string) => {
        const formData = new FormData();
        formData.set('id', id);
        formData.set('currentStatus', currentStatus);

        rejectReceivedFriendRequest(formData);
    };

    const cancel = (id: string, currentStatus: string) => {
        const formData = new FormData();
        formData.set('id', id);
        formData.set('currentStatus', currentStatus);

        cancelSentFriendRequest(formData);
    };

    const remove = (id: string, currentStatus: string) => {
        const formData = new FormData();
        formData.set('id', id);
        formData.set('currentStatus', currentStatus);

        deleteFriend(formData);
    };

    return {
        accept,
        reject,
        cancel,
        remove,
    };
}
