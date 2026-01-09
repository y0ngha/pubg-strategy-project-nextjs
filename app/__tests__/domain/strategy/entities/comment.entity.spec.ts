import { Comment } from '@domain/strategy/entities/comment.entity';
import { Position } from '@domain/strategy/value-objects/position';
import { UserId } from '@domain/shared/value-objects/user-id';
import { Email } from '@domain/shared/value-objects/email';
import {
    CommentContentBlankException,
    DeletedCommentException,
    InvalidAuthorException,
    SameContentException,
} from '@domain/strategy/exceptions/strategy.exceptions';
import { CommentId } from '@domain/strategy/value-objects/comment-id';

describe('Comemnt', () => {
    const position = Position.create(10, 10);
    const authorId = UserId.generate();
    const authorEmail = Email.create('test@domain.com');

    describe('Create', () => {
        it('내용이 비어있지 않으면 생성된다.', () => {
            // given
            const content = '댓글';

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

        it('내용의 양 옆 공백은 삭제된 채 생성된다.', () => {
            // given
            const content = ' 댓글 ';

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
            expect(comment.content).toBe(content.trim());
            expect(comment.parentCommentId).toBeNull();
        });

        it('내용이 비어있으면 에러를 던진다.', () => {
            // given
            const content = '';

            // when & then
            expect(() =>
                Comment.create(position, authorId, authorEmail, content, null)
            ).toThrow(CommentContentBlankException);
        });

        it('내용이 공백(스페이스바)으로 채워져 있으면 에러를 던진다.', () => {
            // given
            const content = '   ';

            // when & then
            expect(() =>
                Comment.create(position, authorId, authorEmail, content, null)
            ).toThrow(CommentContentBlankException);
        });
    });
    describe('Reconstruct', () => {
        const commentId = CommentId.generate();
        const parentCommentId = CommentId.generate();
        const createdAt = new Date();
        const updatedAt = new Date();
        it('내용이 비어있지 않으면 재생성된다.', () => {
            // given
            const content = '댓글';

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
            const content = ' 댓글 ';

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
            expect(comment.content).toBe(content.trim());
            expect(comment.parentCommentId).toBe(parentCommentId);
        });

        it('내용이 비어있으면 에러를 던진다.', () => {
            // given
            const content = '';

            // when & then
            expect(() =>
                Comment.reconstruct(
                    commentId,
                    position,
                    authorId,
                    authorEmail,
                    content,
                    null,
                    createdAt,
                    updatedAt
                )
            ).toThrow(CommentContentBlankException);
        });

        it('내용이 공백(스페이스바)으로 채워져 있으면 에러를 던진다.', () => {
            // given
            const content = '   ';

            // when & then
            expect(() =>
                Comment.reconstruct(
                    commentId,
                    position,
                    authorId,
                    authorEmail,
                    content,
                    null,
                    createdAt,
                    updatedAt
                )
            ).toThrow(CommentContentBlankException);
        });
    });

    describe('IsChild', () => {
        it('ParentCommentId가 채워져있으면 자식 댓글이다.', () => {
            // given
            const content = '댓글';
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
            const content = '댓글';
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
        it('ParentCommentId가 Null이면 부모 댓글이다.', () => {
            // given
            const content = '댓글';
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
            const content = '댓글';
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
        it('삭제되지 않은 댓글이고, 내용의 비어있지 않으며 이전 내용과 틀리고, 작성자 본인이 업데이트한다면 양 옆 공백은 삭제되고 업데이트 된다.', () => {
            // given
            const oldContent = '댓글';
            const comment = Comment.create(
                position,
                authorId,
                authorEmail,
                oldContent,
                null
            );
            const newContent = '새로운 댓글';
            const tryingToUpdateUserId = authorId;
            const oldUpdateAt = comment.updatedAt;

            // when
            jest.useFakeTimers();
            jest.advanceTimersByTime(1000);

            comment.updateContent(tryingToUpdateUserId, newContent);

            // then
            expect(comment.content).toBe(newContent);
            expect(comment.updatedAt.getTime()).toBeGreaterThan(
                oldUpdateAt.getTime()
            );
        });

        it('작성자 본인이 업데이트하는게 아니라면 에러를 던진다.', () => {
            // given
            const oldContent = '댓글';
            const comment = Comment.create(
                position,
                authorId,
                authorEmail,
                oldContent,
                null
            );
            const newContent = '새로운 댓글';
            const tryingToUpdateUserId = UserId.generate();

            // when & then
            expect(() =>
                comment.updateContent(tryingToUpdateUserId, newContent)
            ).toThrow(InvalidAuthorException);
        });

        it('삭제되지 않은 댓글이고, 내용이 비어있지 않으나 이전 내용과 같다면 에러를 던진다.', () => {
            // given
            const oldContent = '댓글';
            const comment = Comment.create(
                position,
                authorId,
                authorEmail,
                oldContent,
                null
            );
            const newContent = '댓글';
            const tryingToUpdateUserId = authorId;

            // when & then
            expect(() =>
                comment.updateContent(tryingToUpdateUserId, newContent)
            ).toThrow(SameContentException);
        });

        it('삭제되지 않은 댓글이고, 내용이 비어있으면 에러를 던진다.', () => {
            // given
            const oldContent = '댓글';
            const comment = Comment.create(
                position,
                authorId,
                authorEmail,
                oldContent,
                null
            );
            const newContent = '';
            const tryingToUpdateUserId = authorId;

            // when & then
            expect(() =>
                comment.updateContent(tryingToUpdateUserId, newContent)
            ).toThrow(CommentContentBlankException);
        });

        it('삭제되지 않은 댓글이고, 내용이 공백(스페이스바)으로 채워져 있으면 에러를 던진다.', () => {
            // given
            const oldContent = '댓글';
            const comment = Comment.create(
                position,
                authorId,
                authorEmail,
                oldContent,
                null
            );
            const newContent = '     ';
            const tryingToUpdateUserId = authorId;

            // when & then
            expect(() =>
                comment.updateContent(tryingToUpdateUserId, newContent)
            ).toThrow(CommentContentBlankException);
        });

        it('삭제된 댓글이라면, 에러를 던진다.', () => {
            // given
            const oldContent = '댓글';
            const comment = Comment.create(
                position,
                authorId,
                authorEmail,
                oldContent,
                null
            );
            comment.delete(authorId);
            const newContent = '새로운 댓글';
            const tryingToUpdateUserId = authorId;

            // when & then
            expect(() =>
                comment.updateContent(tryingToUpdateUserId, newContent)
            ).toThrow(DeletedCommentException);
        });
    });

    describe('Delete', () => {
        it('삭제되어 있지 않은 댓글이고, 작성자 본인이 삭제한 것이라면 삭제된다.', () => {
            // given
            const oldContent = '댓글';
            const comment = Comment.create(
                position,
                authorId,
                authorEmail,
                oldContent,
                null
            );
            const tryingToDeleteUserId = authorId;

            // when
            comment.delete(tryingToDeleteUserId);

            // then
            expect(comment.isDeleted).toBeTruthy();
        });

        it('삭제되어 있지 않은 댓글이고, 작성자 본인이 삭제한 것이 아니라면 에러를 던진다.', () => {
            // given
            const oldContent = '댓글';
            const comment = Comment.create(
                position,
                authorId,
                authorEmail,
                oldContent,
                null
            );
            const tryingToDeleteUserId = UserId.generate();

            // when & then
            expect(() => comment.delete(tryingToDeleteUserId)).toThrow(
                InvalidAuthorException
            );
        });

        it('삭제된 댓글이라면, 에러를 던진다.', () => {
            // given
            const oldContent = '댓글';
            const comment = Comment.create(
                position,
                authorId,
                authorEmail,
                oldContent,
                null
            );
            comment.delete(authorId);
            const tryingToDeleteUserId = authorId;

            // when & then
            expect(() => comment.delete(tryingToDeleteUserId)).toThrow(
                DeletedCommentException
            );
        });
    });
});
