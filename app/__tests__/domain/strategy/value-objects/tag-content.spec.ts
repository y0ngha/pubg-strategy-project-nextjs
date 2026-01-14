import { TagContentBlankException } from '@domain/strategy/exceptions/strategy.exceptions';
import { TagContent } from '@domain/strategy/value-objects/tag-content';

describe('TagContent', () => {
    const validTagContent = '태그';

    describe('create', () => {
        it('유효한 값으로 TagContent를 생성한다', () => {
            // When
            const tagContent = TagContent.create(validTagContent);

            // Then
            expect(tagContent).toBeInstanceOf(TagContent);
            expect(tagContent.toString()).toBe(validTagContent);
        });

        it('TagContent를 생성할 때 양 옆 공백은 삭제되고 생성한다', () => {
            // Given
            const content = ' 태 그 ';

            // When
            const tagContent = TagContent.create(content);

            // Then
            expect(tagContent).toBeInstanceOf(TagContent);
            expect(tagContent.toString()).toBe(content.trim());
        });

        it('빈 문자열은 에러를 던진다', () => {
            // When & Then
            expect(() => TagContent.create('')).toThrow(
                new TagContentBlankException()
            );
        });

        it('공백만 있는 문자열은 에러를 던진다', () => {
            // When & Then
            expect(() => TagContent.create('   ')).toThrow(
                new TagContentBlankException()
            );
        });
    });

    describe('equals', () => {
        it('같은 값을 가진 TagContent는 동등하다', () => {
            // Given
            const tagContent1 = TagContent.create(validTagContent);
            const tagContent2 = TagContent.create(validTagContent);

            // When & Then
            expect(tagContent1.equals(tagContent2)).toBe(true);
        });

        it('다른 값을 가진 TagContent는 동등하지 않다', () => {
            // Given
            const tagContent1 = TagContent.create('A');
            const tagContent2 = TagContent.create('B');

            // When & Then
            expect(tagContent1.equals(tagContent2)).toBe(false);
        });

        it('TagContent가 아닌 객체는 동등하지 않다', () => {
            // Given
            const tagContent = TagContent.create(validTagContent);
            const notTagContent = { label: 'A' } as never;

            // When & Then
            expect(tagContent.equals(notTagContent)).toBe(false);
        });
    });

    describe('toString', () => {
        it('원시 값을 반환한다', () => {
            // Given
            const tagContent = TagContent.create(validTagContent);

            // When
            const result = tagContent.toString();

            // Then
            expect(result).toBe(validTagContent);
        });
    });

    describe('toJSON', () => {
        it('JSON 직렬화 시 원시 값을 반환한다', () => {
            // Given
            const tagContent = TagContent.create(validTagContent);

            // When
            const result = JSON.stringify({ tagContent });

            // Then
            expect(result).toBe(`{"tagContent":"${validTagContent}"}`);
        });
    });
});
