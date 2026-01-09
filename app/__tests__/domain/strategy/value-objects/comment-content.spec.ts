import { CommentContent } from '@domain/strategy/value-objects/comment-content';
import { CommentContentBlankException } from '@domain/strategy/exceptions/strategy.exceptions';

describe('CommentContent', () => {
    const validCommentContent = '댓글';

    describe('create', () => {
        it('유효한 값으로 CommentContent를 생성한다', () => {
            // When
            const commentContent = CommentContent.create(validCommentContent);

            // Then
            expect(commentContent).toBeInstanceOf(CommentContent);
            expect(commentContent.toString()).toBe(validCommentContent);
        });

        it('CommentContent를 생성할 때 양 옆 공백은 삭제되고 생성한다', () => {
            // Given
            const content = ' 댓 글 ';

            // When
            const commentContent = CommentContent.create(content);

            // Then
            expect(commentContent).toBeInstanceOf(CommentContent);
            expect(commentContent.toString()).toBe(content.trim());
        });

        it('빈 문자열은 에러를 던진다', () => {
            // When & Then
            expect(() => CommentContent.create('')).toThrow(
                new CommentContentBlankException()
            );
        });

        it('공백만 있는 문자열은 에러를 던진다', () => {
            // When & Then
            expect(() => CommentContent.create('   ')).toThrow(
                new CommentContentBlankException()
            );
        });
    });

    describe('equals', () => {
        it('같은 값을 가진 CommentContent는 동등하다', () => {
            // Given
            const commentContent1 = CommentContent.create(validCommentContent);
            const commentContent2 = CommentContent.create(validCommentContent);

            // When & Then
            expect(commentContent1.equals(commentContent2)).toBe(true);
        });

        it('다른 값을 가진 CommentContent는 동등하지 않다', () => {
            // Given
            const commentContent1 = CommentContent.create('A');
            const commentContent2 = CommentContent.create('B');

            // When & Then
            expect(commentContent1.equals(commentContent2)).toBe(false);
        });

        it('CommentContent가 아닌 객체는 동등하지 않다', () => {
            // Given
            const commentContent = CommentContent.create(validCommentContent);
            const notCommentContent = { label: 'A' } as never;

            // When & Then
            expect(commentContent.equals(notCommentContent)).toBe(false);
        });
    });

    describe('toString', () => {
        it('원시 값을 반환한다', () => {
            // Given
            const commentContent = CommentContent.create(validCommentContent);

            // When
            const result = commentContent.toString();

            // Then
            expect(result).toBe(validCommentContent);
        });
    });

    describe('toJSON', () => {
        it('JSON 직렬화 시 원시 값을 반환한다', () => {
            // Given
            const commentContent = CommentContent.create(validCommentContent);

            // When
            const result = JSON.stringify({ commentContent });

            // Then
            expect(result).toBe(`{"commentContent":"${validCommentContent}"}`);
        });
    });
});
