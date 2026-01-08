import { Position } from '@domain/strategy/value-objects/position';
import { Tag } from '@domain/strategy/entities/tag.entity';
import {
    DeletedTagException,
    SamePositionException,
    TagContentBlankException,
} from '@domain/strategy/exceptions/strategy.exceptions';
import { TagId } from '@domain/strategy/value-objects/tag-id';

describe('Tag', () => {
    const position = Position.create(10, 10);

    describe('Create', () => {
        it('Content가 빈 값이 아니면 생성된다.', () => {
            // given
            const content = '테스트입니다.';

            // when
            const tag = Tag.create(position, content);

            // then
            expect(tag.content).toBe(content);
            expect(tag.position).toEqual(position);
        });

        it('Content의 앞 뒤 공백은 삭제 된 채로 생성된다.', () => {
            // given
            const content = ' 테스트입니다. ';

            // when
            const tag = Tag.create(position, content);

            // then
            expect(tag.content).not.toBe(content);
            expect(tag.content).toBe(content.trim());
            expect(tag.position).toEqual(position);
        });

        it('Content가 빈 값이면 에러를 던진다.', () => {
            // given
            const content = '';

            // when
            expect(() => Tag.create(position, content)).toThrow(
                TagContentBlankException
            );
        });

        it('Content가 공백(스페이스바)로 채워져 있으면 에러를 던진다.', () => {
            // given
            const content = '   ';

            // when
            expect(() => Tag.create(position, content)).toThrow(
                TagContentBlankException
            );
        });
    });

    describe('Reconstruct', () => {
        const id = TagId.generate();
        const createdAt = new Date();
        const updatedAt = new Date();

        it('Content가 빈 값이 아니면 재생성된다.', () => {
            // given
            const content = '테스트입니다.';

            // when
            const tag = Tag.reconstruct(
                id,
                position,
                content,
                createdAt,
                updatedAt
            );

            // then
            expect(tag.content).toBe(content);
            expect(tag.position).toEqual(position);
        });

        it('Content의 앞 뒤 공백은 삭제 된 채로 재생성된다.', () => {
            // given
            const content = ' 테스트입니다. ';

            // when
            const tag = Tag.reconstruct(
                id,
                position,
                content,
                createdAt,
                updatedAt
            );

            // then
            expect(tag.content).not.toBe(content);
            expect(tag.content).toBe(content.trim());
            expect(tag.position).toEqual(position);
        });

        it('Content가 빈 값이면 에러를 던진다.', () => {
            // given
            const content = '';

            // when
            expect(() =>
                Tag.reconstruct(id, position, content, createdAt, updatedAt)
            ).toThrow(TagContentBlankException);
        });

        it('Content가 공백(스페이스바)로 채워져 있으면 에러를 던진다.', () => {
            // given
            const content = '   ';

            // when
            expect(() =>
                Tag.reconstruct(id, position, content, createdAt, updatedAt)
            ).toThrow(TagContentBlankException);
        });
    });

    describe('UpdatePosition', () => {
        const newPosition = Position.create(200, 200);
        it('태그가 삭제된 객체가 아니라면, 포지션 업데이트시 업데이트 된다.', () => {
            // given
            const tag = Tag.create(position, '태그');
            const oldUpdatedAt = tag.updatedAt;
            // when
            tag.updatePosition(newPosition);

            // then
            expect(tag.position).toEqual(newPosition);
            expect(tag.updatedAt).not.toBe(oldUpdatedAt);
        });

        it('같은 포지션으로 업데이트시 에러를 던진다.', () => {
            // given
            const tag = Tag.create(position, '태그');

            // when & then
            expect(() => tag.updatePosition(position)).toThrow(
                SamePositionException
            );
        });

        it('태그가 삭제된 객체라면, 포지션 업데이트시 에러를 던진다.', () => {
            // given
            const tag = Tag.create(position, '태그');
            tag.delete();

            // when & then
            expect(() => tag.updatePosition(newPosition)).toThrow(
                DeletedTagException
            );
        });
    });

    describe('UpdateContent', () => {
        const oldContent = '태그';
        it('업데이트하려는 내용의 이전과 다르다면 업데이트 된다.', () => {
            // given
            const tag = Tag.create(position, oldContent);
            const newContent = '테스트';
            const oldUpdatedAt = tag.updatedAt;

            // when
            tag.updateContent(newContent);

            // then
            expect(tag.content).toBe(newContent);
            expect(tag.updatedAt).not.toBe(oldUpdatedAt);
        });

        it('업데이트하려는 내용의 앞 뒤 공백은 삭제 된 채로 업데이트 된다.', () => {
            // given
            const tag = Tag.create(position, oldContent);
            const newContent = ' 앞 뒤 공백 ';
            const oldUpdatedAt = tag.updatedAt;

            // when
            tag.updateContent(newContent);

            // then
            expect(tag.content).toBe('앞 뒤 공백');
            expect(tag.updatedAt).not.toBe(oldUpdatedAt);
        });

        it('업데이트하려는 내용이 빈 값이면 에러를 던진다.', () => {
            // given
            const tag = Tag.create(position, oldContent);
            const newContent = '';

            // when & then
            expect(() => tag.updateContent(newContent)).toThrow(
                TagContentBlankException
            );
        });

        it('업데이트하려는 내용이 공백(스페이스바)으로 채워져 있으면 에러를 던진다.', () => {
            // given
            const tag = Tag.create(position, oldContent);
            const newContent = '     ';

            // when & then
            expect(() => tag.updateContent(newContent)).toThrow(
                TagContentBlankException
            );
        });

        it('업데이트하려는 내용이 이전과 같으면 업데이트는 무시된다.', () => {
            // given
            const tag = Tag.create(position, oldContent);
            const oldUpdatedAt = tag.updatedAt;

            // when
            tag.updateContent(oldContent);

            // then
            expect(tag.content).toBe(oldContent);
            expect(tag.updatedAt).toBe(oldUpdatedAt);
        });
    });

    describe('Delete', () => {
        it('태그가 삭제된 객체가 아니라면, 삭제된다.', () => {
            // given
            const tag = Tag.create(position, '태그');

            // when
            tag.delete();

            // then
            expect(tag.isDeleted).toBeTruthy();
        });

        it('태그가 이미 삭제된 객체라면, 에러를 던진다.', () => {
            // given
            const tag = Tag.create(position, '태그');
            tag.delete();

            // when & then
            expect(() => tag.delete()).toThrow(DeletedTagException);
        });
    });
});
