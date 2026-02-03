'use client';

import {
    ChangeEvent,
    HTMLAttributes,
    KeyboardEvent as ReactKeyboardEvent,
    ReactNode,
    RefObject,
    useEffect,
    useEffectEvent,
    useRef,
    useState,
    useSyncExternalStore,
} from 'react';
import { CornerDownRight, Pencil, Send, Trash2, User, X } from 'lucide-react';
import {
    ChildCommentResponseDto,
    CommentResponseDto,
} from '@/application/strategy/dto/strategy/get-strategy.dto';
import Button from '@/(presentation)/shared/components/button.component';
import { toYyyyMmDdHhMmString } from '@/(presentation)/shared/helpers/date.helper';
import { cn } from '@/(presentation)/shared/utils/class-names.util';

interface StrategyCommentWindowProps {
    isOpen: boolean;
    onClose: () => void;
    comments: CommentResponseDto[];
    onAddComment: (content: string, parentId: string | null) => void;
    onUpdateComment: (commentId: string, content: string) => void;
    position: { x: number; y: number };
}

interface CommentProps {
    comment: CommentResponseDto | ChildCommentResponseDto;
    onReply?: () => void;
    onDelete?: (id: string) => void;
    onEdit?: (id: string) => void;
    isAuthor: boolean;
    isEditing: boolean;
}

const subscribe = () => () => {};
const getSnapshot = () => true;
const getServerSnapshot = () => false;

function CommentAuthorInformation({
    author,
    createdDate,
}: {
    author: string;
    createdDate: string;
}) {
    return (
        <div className={'flex items-center gap-2'}>
            <span className={'font-semibold text-zinc-200'}>{author}</span>
            <span className={'text-xs text-zinc-500'}>{createdDate}</span>
        </div>
    );
}

function CommentAvatar() {
    return (
        <div
            className={
                'flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-zinc-700 bg-zinc-800 text-zinc-400'
            }
        >
            <User className={'h-4 w-4'} />
        </div>
    );
}

function CommentContent({
    children,
    className,
}: {
    children: ReactNode;
    className?: string;
}) {
    return (
        <p
            className={cn(
                'mt-1 leading-relaxed break-all whitespace-pre-wrap text-zinc-300',
                className
            )}
        >
            {children}
        </p>
    );
}

function CommentAuthorMenuButton({
    onClick,
    className,
    children,
}: HTMLAttributes<HTMLButtonElement>) {
    return (
        <button
            onClick={onClick}
            className={cn(
                'transition-colors" text-zinc-400, rounded p-1 hover:bg-zinc-800',
                className
            )}
        >
            {children}
        </button>
    );
}

function CommentAuthorMenu({
    onDelete,
    onEdit,
    commentId,
}: { commentId: string } & Pick<CommentProps, 'onEdit' | 'onDelete'>) {
    return (
        <div className="absolute top-0 right-0 flex gap-1 rounded-md bg-zinc-900/80 p-1 opacity-0 backdrop-blur-sm transition-opacity duration-200 group-hover:opacity-100">
            <CommentAuthorMenuButton
                className={'hover:text-sky-400'}
                onClick={() => onEdit?.(commentId)}
            >
                <Pencil className="h-3.5 w-3.5" />
            </CommentAuthorMenuButton>
            <CommentAuthorMenuButton
                className={'hover:text-red-500'}
                onClick={() => onDelete?.(commentId)}
            >
                <Trash2 className="h-3.5 w-3.5" />
            </CommentAuthorMenuButton>
        </div>
    );
}

function Comment({
    comment,
    onReply,
    onDelete,
    onEdit,
    isAuthor,
    isEditing,
}: CommentProps) {
    const formattedDate = toYyyyMmDdHhMmString(comment.createdAt);
    const author = comment.authorEmail;

    return (
        <div className={'group relative flex gap-3 text-sm'}>
            <CommentAvatar />

            <div className={'flex-1'}>
                <CommentAuthorInformation
                    author={author}
                    createdDate={formattedDate}
                />

                <CommentContent
                    className={
                        isEditing
                            ? 'border border-dashed border-amber-50'
                            : undefined
                    }
                >
                    {comment.content}
                </CommentContent>

                {onReply && (
                    <Button
                        type={'button'}
                        onClick={onReply}
                        variant={'ghost'}
                        className={'p-0'}
                    >
                        <CornerDownRight className={'h-3 w-3'} /> 답글 달기
                    </Button>
                )}
            </div>

            {isAuthor && !isEditing && (
                <CommentAuthorMenu
                    commentId={comment.id}
                    onEdit={onEdit}
                    onDelete={onDelete}
                />
            )}
        </div>
    );
}

function CommentWindowHeader({
    onClose,
}: Pick<StrategyCommentWindowProps, 'onClose'>) {
    return (
        <div
            className={
                'flex shrink-0 items-center justify-between border-b border-zinc-800 p-4'
            }
        >
            <h3 className={'font-bold text-sky-500 select-none'}>댓글</h3>
            <Button type={'button'} variant={'ghost'} onClick={onClose}>
                <X className={'h-4 w-4'} />
            </Button>
        </div>
    );
}

function CommentWindowBody({
    comments,
    onReply,
    onEdit,
    editTargetId,
}: {
    onReply: ({ id, author }: { id: string; author: string }) => void;
    onEdit: (id: string) => void;
    editTargetId?: string;
} & Pick<StrategyCommentWindowProps, 'comments'>) {
    return (
        <div
            className={
                'flex-1 overflow-y-auto p-4 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-zinc-700 hover:[&::-webkit-scrollbar-thumb]:bg-zinc-600 [&::-webkit-scrollbar-track]:bg-transparent'
            }
        >
            {comments.length === 0 && <CommentsEmptyInformation />}

            {comments.map(root => (
                <div key={root.id} className={'mb-6'}>
                    <Comment
                        comment={root}
                        onReply={() =>
                            onReply({ id: root.id, author: root.authorEmail })
                        }
                        onEdit={onEdit}
                        isAuthor={root.isAuthor}
                        isEditing={root.id === editTargetId}
                    />

                    {root.childComments && root.childComments.length > 0 && (
                        <div
                            className={
                                'mt-2 ml-2 flex flex-col gap-2 border-l-2 border-zinc-800 pl-4'
                            }
                        >
                            {root.childComments.map(child => (
                                <Comment
                                    key={child.id}
                                    comment={child}
                                    onEdit={onEdit}
                                    isAuthor={root.isAuthor}
                                    isEditing={child.id === editTargetId}
                                />
                            ))}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}

function CommentsEmptyInformation() {
    return (
        <div className={'py-10 text-center text-sm text-zinc-500 select-none'}>
            댓글을 남겨보세요.
        </div>
    );
}

function CommentActionInformation({
    children,
    onCancel,
}: {
    children: ReactNode;
    onCancel: () => void;
}) {
    return (
        <div
            className={
                'mb-2 flex items-center justify-between rounded bg-sky-500/10 p-2 text-xs text-sky-400'
            }
        >
            <span>{children}</span>
            <Button type={'button'} variant={'ghost'} onClick={onCancel}>
                <X className={'h-3 w-3'} />
            </Button>
        </div>
    );
}

function CommentInput({
    ref,
    isReply,
    inputText,
    onChangeInputText,
    handleSubmit,
}: {
    ref: RefObject<HTMLTextAreaElement | null>;
    isReply: boolean;
    inputText: string;
    onChangeInputText: (inputText: string) => void;
    handleSubmit: () => void;
}) {
    const [selectionStart, setSelectionStart] = useState<number>(0);

    const handleKeyDown = (event: ReactKeyboardEvent<HTMLTextAreaElement>) => {
        if (event.nativeEvent.isComposing) {
            return;
        }

        const _selectionStart = event.currentTarget.selectionStart;

        if (event.key === 'Enter') {
            if (event.shiftKey) {
                setSelectionStart(_selectionStart + 1);
                event.preventDefault();
                const head = inputText.slice(0, _selectionStart);
                const tail = inputText.slice(_selectionStart);
                const text = head + '\n' + tail;
                onChangeInputText(text);
            } else {
                event.preventDefault();
                handleSubmit();
            }
        }
    };

    const handleKeyUp = (event: ReactKeyboardEvent<HTMLTextAreaElement>) => {
        if (event.key === 'Enter' && event.shiftKey) {
            event.currentTarget.setSelectionRange(
                selectionStart,
                selectionStart
            );
        }
    };

    const handleChange = (
        event: ChangeEvent<HTMLTextAreaElement> & {
            nativeEvent: { inputType: string };
        }
    ) => {
        onChangeInputText(event.target.value.trim());
        setSelectionStart(event.target.selectionStart);
    };

    return (
        <textarea
            name={'content'}
            ref={ref}
            value={inputText}
            inputMode={'text'}
            placeholder={
                isReply ? '답글을 입력하세요...' : '새로운 댓글을 입력하세요...'
            }
            className={
                'max-h-25 min-h-10 w-full flex-1 resize-none rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 focus:ring-1 focus:ring-sky-500 focus:outline-none'
            }
            rows={2}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onKeyUp={handleKeyUp}
        />
    );
}

function CommentConfirm({
    handleSubmit,
    disabled,
}: {
    handleSubmit: () => void;
    disabled: boolean;
}) {
    return (
        <Button
            type={'submit'}
            variant={'primary'}
            onClick={handleSubmit}
            disabled={disabled}
            className={
                'inline-flex h-15 w-10 shrink-0 items-center justify-center rounded-md bg-sky-500 text-white transition-colors hover:bg-sky-600 disabled:cursor-not-allowed disabled:opacity-50'
            }
        >
            <Send className={'h-4 w-4'} />
        </Button>
    );
}

function StrategyCommentWindow({
    isOpen,
    onClose,
    comments,
    onAddComment,
    onUpdateComment,
    position,
}: StrategyCommentWindowProps) {
    const mounted = useSyncExternalStore(
        subscribe,
        getSnapshot,
        getServerSnapshot
    );

    const defaultWidth = 384;
    const defaultHeight = 500;

    const adjustedPosition = {
        x:
            position.x + defaultWidth > window.innerWidth - 20
                ? position.x - defaultWidth
                : position.x,
        y:
            position.y + defaultHeight > window.innerHeight - 20
                ? position.y - defaultHeight
                : position.y,
    };

    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const [inputText, setInputText] = useState('');

    const [replyTarget, setReplyTarget] = useState<
        | {
              id: string;
              author: string;
          }
        | undefined
    >(undefined);

    const [editTargetId, setEditTargetId] = useState<string | undefined>(
        undefined
    );

    const stateClear = () => {
        setInputText('');
        setReplyTarget(undefined);
        setEditTargetId(undefined);
    };

    const handleSubmit = () => {
        if (!inputText.trim()) return;

        if (!editTargetId) {
            onAddComment(inputText, replyTarget?.id || null);
        } else {
            onUpdateComment(editTargetId, inputText);
        }

        stateClear();
    };

    const handleEdit = (id: string) => {
        const comment = comments
            .flatMap(comment => [comment, ...comment.childComments])
            .find(comment => comment.id === id);

        if (!comment) {
            throw new Error('댓글 수정에 오류가 발생했습니다.');
        }

        setEditTargetId(id);
        setInputText(comment.content ?? '');

        textareaRef.current?.focus();
    };

    const handleClose = () => {
        stateClear();
        onClose();
    };

    const escKeydownHandler = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
            onClose();
        }
    };

    const modalSetup = useEffectEvent(() => {
        window.addEventListener('keydown', escKeydownHandler);
    });

    const modalCleanup = useEffectEvent(() => {
        window.removeEventListener('keydown', escKeydownHandler);
    });

    useEffect(() => {
        if (isOpen) {
            modalSetup();

            return () => {
                modalCleanup();
            };
        }
    }, [isOpen]);

    if (!mounted) {
        return null;
    }

    if (!isOpen) {
        return null;
    }

    return (
        <div
            style={{
                top: adjustedPosition.y,
                left: adjustedPosition.x,
                visibility: position ? 'visible' : 'hidden',
            }}
            className={
                'absolute z-50 flex h-125 w-96 flex-col overflow-hidden rounded-xl border border-zinc-700 bg-zinc-900/95 shadow-2xl backdrop-blur-sm'
            }
        >
            <CommentWindowHeader onClose={handleClose} />

            <CommentWindowBody
                comments={comments}
                onReply={setReplyTarget}
                onEdit={handleEdit}
                editTargetId={editTargetId}
            />

            <div
                className={
                    'shrink-0 rounded-b-xl border-t border-zinc-800 bg-zinc-900/50 p-4'
                }
            >
                {replyTarget && (
                    <CommentActionInformation
                        onCancel={() => setReplyTarget(undefined)}
                    >
                        <span className={'font-bold'}>
                            {replyTarget.author}
                        </span>
                        님에게 답글 작성 중...
                    </CommentActionInformation>
                )}

                {editTargetId && (
                    <CommentActionInformation
                        onCancel={() => setEditTargetId(undefined)}
                    >
                        댓글 수정 중...
                    </CommentActionInformation>
                )}

                <div className={'flex gap-2'}>
                    <CommentInput
                        ref={textareaRef}
                        inputText={inputText}
                        handleSubmit={handleSubmit}
                        onChangeInputText={inputText => setInputText(inputText)}
                        isReply={replyTarget !== null}
                    />

                    <CommentConfirm
                        handleSubmit={handleSubmit}
                        disabled={inputText === ''}
                    />
                </div>
            </div>
        </div>
    );
}

CommentAuthorInformation.displayName =
    'StrategyCommentWindow-CommentAuthorInformation';
Comment.displayName = 'StrategyCommentWindow-Comment';
CommentWindowHeader.displayName = 'StrategyCommentWindow-CommentWindowHeader';
CommentWindowBody.displayName = 'StrategyCommentWindow-CommentWindowBody';
CommentsEmptyInformation.displayName =
    'StrategyCommentWindow-CommentsEmptyInformation';
CommentActionInformation.displayName =
    'StrategyCommentWindow-CommentActionInformation';
CommentInput.displayName = 'StrategyCommentWindow-CommentInput';
CommentConfirm.displayName = 'StrategyCommentWindow-CommentConfirm';
CommentAvatar.displayName = 'StrategyCommentWindow-CommentAvatar';
CommentContent.displayName = 'StrategyCommentWindow-CommentContent';
CommentAuthorMenuButton.displayName =
    'StrategyCommentWindow-CommentAuthorMenuButton';
CommentAuthorMenu.displayName = 'StrategyCommentWindow-CommentAuthorMenu';
StrategyCommentWindow.displayName = 'StrategyCommentWindow';

export default StrategyCommentWindow;
