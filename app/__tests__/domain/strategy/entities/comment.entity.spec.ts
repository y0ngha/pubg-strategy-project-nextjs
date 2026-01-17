import { Comment } from '@domain/strategy/entities/comment.entity';
import { Position } from '@domain/strategy/value-objects/position';
import { UserId } from '@domain/shared/value-objects/user-id';
import { Email } from '@domain/shared/value-objects/email';
import {
    ChildCommentException,
    DeletedCommentException,
    InvalidAuthorException,
    ParentCommentPositionRequiredException,
} from '@domain/strategy/exceptions/strategy.exceptions';
import { CommentId } from '@domain/strategy/value-objects/comment-id';
import { CommentContent } from '@domain/strategy/value-objects/comment-content';

describe('Comment', () => {
    const position = Position.create(10, 10);
    const authorId = UserId.generate();
    const authorEmail = Email.create('test@domain.com');

    beforeEach(() => {
        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    describe('Create', () => {
        it('내용이 비어있지 않으면 생성된다.', () => {
            // given
            const content = CommentContent.create('댓글');

            // when
            const comment = Comment.create(
                position,
                authorId,
                authorEmail,
                content,
                null
            );

            // then
            expect(comment.position).toBe(position);
            expect(comment.authorId).toBe(authorId);
            expect(comment.authorEmail).toBe(authorEmail);
            expect(comment.content).toBe(content);
            expect(comment.parentCommentId).toBeNull();
        });

        it('부모로 생성된 경우 포지션은 반드시 필요하다. 없으면 에러를 던진다.', () => {
            // given
            const content = CommentContent.create('댓글');

            // when & then
            expect(() =>
                Comment.create(null, authorId, authorEmail, content, null)
            ).toThrow(ParentCommentPositionRequiredException);
        });

        it('자식으로 생성된 경우 포지션은 NULL이 허용된다.', () => {
            // given
            const content = CommentContent.create('댓글');
            const parentCommemnt = Comment.create(
                position,
                authorId,
                authorEmail,
                content,
                null
            );

            // when
            const childComment = Comment.create(
                null,
                authorId,
                authorEmail,
                content,
                parentCommemnt.id
            );

            // then
            expect(childComment.position).toBeNull();
            expect(childComment.authorId).toBe(authorId);
            expect(childComment.authorEmail).toBe(authorEmail);
            expect(childComment.content).toBe(content);
            expect(childComment.parentCommentId).not.toBeNull();
        });

        it('내용의 양 옆 공백은 삭제된 채 생성된다.', () => {
            // given
            const content = CommentContent.create(' 댓글 ');

            // when
            const comment = Comment.create(
                position,
                authorId,
                authorEmail,
                content,
                null
            );

            // then
            expect(comment.position).toBe(position);
            expect(comment.authorId).toBe(authorId);
            expect(comment.authorEmail).toBe(authorEmail);
            expect(comment.content.toString()).toBe('댓글');
            expect(comment.parentCommentId).toBeNull();
        });
    });
    describe('Reconstruct', () => {
        const commentId = CommentId.generate();
        const parentCommentId = CommentId.generate();
        const createdAt = new Date();
        const updatedAt = new Date();
        it('내용이 비어있지 않으면 재생성된다.', () => {
            // given
            const content = CommentContent.create('댓글');

            // when
            const comment = Comment.reconstruct(
                commentId,
                position,
                authorId,
                authorEmail,
                content,
                null,
                createdAt,
                updatedAt
            );

            // then
            expect(comment.position).toBe(position);
            expect(comment.authorId).toBe(authorId);
            expect(comment.authorEmail).toBe(authorEmail);
            expect(comment.content).toBe(content);
            expect(comment.parentCommentId).toBeNull();
        });

        it('내용의 양 옆 공백은 삭제된 채 재생성된다.', () => {
            // given
            const content = CommentContent.create(' 댓글 ');

            // when
            const comment = Comment.reconstruct(
                commentId,
                position,
                authorId,
                authorEmail,
                content,
                parentCommentId,
                createdAt,
                updatedAt
            );

            // then
            expect(comment.id).toBe(commentId);
            expect(comment.position).toBe(position);
            expect(comment.authorId).toBe(authorId);
            expect(comment.authorEmail).toBe(authorEmail);
            expect(comment.content.toString()).toBe('댓글');
            expect(comment.parentCommentId).toBe(parentCommentId);
        });
    });

    describe('IsChild', () => {
        const content = CommentContent.create('댓글');

        it('ParentCommentId가 채워져있으면 자식 댓글이다.', () => {
            // given
            const parentCommentId = CommentId.generate();
            const comment = Comment.create(
                position,
                authorId,
                authorEmail,
                content,
                parentCommentId
            );

            // when
            const isChildComment = comment.isChild;

            // then
            expect(isChildComment).toBeTruthy();
        });

        it('ParentCommentId가 Null이면 자식 댓글이 아니다.', () => {
            // given
            const comment = Comment.create(
                position,
                authorId,
                authorEmail,
                content,
                null
            );

            // when
            const isChildComment = comment.isChild;

            // then
            expect(isChildComment).toBeFalsy();
        });
    });
    describe('IsParent', () => {
        const content = CommentContent.create('댓글');

        it('ParentCommentId가 Null이면 부모 댓글이다.', () => {
            // given
            const comment = Comment.create(
                position,
                authorId,
                authorEmail,
                content,
                null
            );

            // when
            const isParentComment = comment.isParent;

            // then
            expect(isParentComment).toBeTruthy();
        });

        it('ParentCommentId가 채워져있으면 부모 댓글이 아니다.', () => {
            // given
            const parentCommentId = CommentId.generate();
            const comment = Comment.create(
                position,
                authorId,
                authorEmail,
                content,
                parentCommentId
            );

            // when
            const isParentComment = comment.isParent;

            // then
            expect(isParentComment).toBeFalsy();
        });
    });

    describe('UpdateContent', () => {
        const oldContent = CommentContent.create('댓글');

        it('삭제되지 않은 댓글이고, 내용의 비어있지 않으며 이전 내용과 틀리고, 작성자 본인이 업데이트한다면 양 옆 공백은 삭제되고 업데이트 된다.', () => {
            // given
            const comment = Comment.create(
                position,
                authorId,
                authorEmail,
                oldContent,
                null
            );
            const newContent = CommentContent.create('새로운 댓글');
            const actorId = authorId;
            const oldUpdatedAt = comment.updatedAt;

            // when
            jest.advanceTimersByTime(1000);

            comment.updateContent(actorId, newContent);

            // then
            expect(comment.content).toBe(newContent);
            expect(comment.updatedAt.getTime()).toBeGreaterThan(
                oldUpdatedAt.getTime()
            );
        });

        it('작성자 본인이 업데이트하는게 아니라면 에러를 던진다.', () => {
            // given
            const comment = Comment.create(
                position,
                authorId,
                authorEmail,
                oldContent,
                null
            );
            const newContent = CommentContent.create('새로운 댓글');
            const actorId = UserId.generate();

            // when & then
            expect(() => comment.updateContent(actorId, newContent)).toThrow(
                InvalidAuthorException
            );
        });

        it('삭제되지 않은 댓글이고, 내용이 비어있지 않으나 이전 내용과 같다면 무시된다.', () => {
            // given
            const comment = Comment.create(
                position,
                authorId,
                authorEmail,
                oldContent,
                null
            );
            const sameContent = CommentContent.create('댓글');
            const oldUpdatedAt = comment.updatedAt;

            const actorId = authorId;

            jest.advanceTimersByTime(1000);

            // when
            comment.updateContent(actorId, sameContent);

            // then
            expect(comment.updatedAt.getTime()).toEqual(oldUpdatedAt.getTime());
            expect(comment.content).toEqual(oldContent);
        });

        it('삭제된 댓글이라면, 에러를 던진다.', () => {
            // given
            const comment = Comment.create(
                position,
                authorId,
                authorEmail,
                oldContent,
                null
            );
            comment.delete(authorId);
            const newContent = CommentContent.create('새로운 댓글');
            const actorId = authorId;

            // when & then
            expect(() => comment.updateContent(actorId, newContent)).toThrow(
                DeletedCommentException
            );
        });
    });

    describe('UpdatePosition', () => {
        const position = Position.create(10, 10);
        const authorId = UserId.generate();
        const newPoisiton = Position.create(10, 20);

        it('삭제되지 않은 댓글이고, 최상위(부모)댓글이며, 작성자 본인이 포지션을 업데이트한다면 업데이트 된다.', () => {
            // given
            const parentComment = Comment.create(
                position,
                authorId,
                Email.create('test@domain.com'),
                CommentContent.create('테스트'),
                null
            );

            const oldUpdatedAt = parentComment.updatedAt;

            // when
            jest.advanceTimersByTime(1000);

            parentComment.updatePosition(authorId, newPoisiton);

            // then
            expect(parentComment.position).toEqual(newPoisiton);
            expect(parentComment.updatedAt.getTime()).toBeGreaterThan(
                oldUpdatedAt.getTime()
            );
        });

        it('삭제되지 않은 댓글이고, 최상위(부모)댓글이며, 작성자 본인이 포지션을 업데이트하는데 같은 포지션으로 업데이트하면 무시된다.', () => {
            // given
            const parentComment = Comment.create(
                position,
                authorId,
                Email.create('test@domain.com'),
                CommentContent.create('테스트'),
                null
            );

            const oldPosition = position;
            const newPosition = position;
            const oldUpdatedAt = parentComment.updatedAt;

            // when
            jest.advanceTimersByTime(1000);

            parentComment.updatePosition(authorId, newPosition);

            // then
            expect(parentComment.position).toEqual(oldPosition);
            expect(parentComment.updatedAt.getTime()).toBe(
                oldUpdatedAt.getTime()
            );
        });

        it('작성자 본인이 업데이트하는게 아니라면 에러를 던진다.', () => {
            // given
            const parentComment = Comment.create(
                position,
                authorId,
                Email.create('test@domain.com'),
                CommentContent.create('테스트'),
                null
            );
            const strangerId = UserId.generate();

            // when & then
            expect(() =>
                parentComment.updatePosition(strangerId, newPoisiton)
            ).toThrow(InvalidAuthorException);
        });

        it('부모 댓글이 아니라면 에러를 던진다.', () => {
            // given
            const childComment = Comment.create(
                position,
                authorId,
                Email.create('test@domain.com'),
                CommentContent.create('테스트'),
                CommentId.generate()
            );

            // when & then
            expect(() =>
                childComment.updatePosition(authorId, newPoisiton)
            ).toThrow(ChildCommentException);
        });

        it('삭제된 댓글이라면, 에러를 던진다.', () => {
            // given
            const comment = Comment.create(
                position,
                authorId,
                Email.create('test@domain.com'),
                CommentContent.create('테스트'),
                null
            );
            comment.delete(authorId);

            // when & then
            expect(() => comment.updatePosition(authorId, newPoisiton)).toThrow(
                DeletedCommentException
            );
        });
    });

    describe('Delete', () => {
        const content = CommentContent.create('댓글');
        it('삭제되어 있지 않은 댓글이고, 작성자 본인이 삭제한 것이라면 삭제된다.', () => {
            // given
            const comment = Comment.create(
                position,
                authorId,
                authorEmail,
                content,
                null
            );
            const actorId = authorId;

            // when
            comment.delete(actorId);

            // then
            expect(comment.isDeleted).toBeTruthy();
        });

        it('삭제되어 있지 않은 댓글이고, 작성자 본인이 삭제한 것이 아니라면 에러를 던진다.', () => {
            // given
            const comment = Comment.create(
                position,
                authorId,
                authorEmail,
                content,
                null
            );
            const actorId = UserId.generate();

            // when & then
            expect(() => comment.delete(actorId)).toThrow(
                InvalidAuthorException
            );
        });

        it('삭제된 댓글이라면, 에러를 던진다.', () => {
            // given
            const comment = Comment.create(
                position,
                authorId,
                authorEmail,
                content,
                null
            );
            comment.delete(authorId);
            const actorId = authorId;

            // when & then
            expect(() => comment.delete(actorId)).toThrow(
                DeletedCommentException
            );
        });
    });
});
