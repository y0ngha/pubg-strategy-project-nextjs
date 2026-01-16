import { Position } from '@domain/strategy/value-objects/position';
import { Tag } from '@domain/strategy/entities/tag.entity';
import {
    DeletedTagException,
    SamePositionException,
} from '@domain/strategy/exceptions/strategy.exceptions';
import { TagId } from '@domain/strategy/value-objects/tag-id';
import { TagContent } from '@domain/strategy/value-objects/tag-content';

describe('Tag', () => {
    const position = Position.create(10, 10);

    beforeEach(() => {
        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    describe('Create', () => {
        it('태그가 생성된다.', () => {
            // given
            const content = TagContent.create('테스트입니다.');

            // when
            const tag = Tag.create(position, content);

            // then
            expect(tag.content).toEqual(content);
            expect(tag.position).toEqual(position);
        });
    });

    describe('Reconstruct', () => {
        const id = TagId.generate();
        const createdAt = new Date();
        const updatedAt = new Date();

        it('태그가 재생성된다.', () => {
            // given
            const content = TagContent.create('테스트입니다.');

            // when
            const tag = Tag.reconstruct(
                id,
                position,
                content,
                createdAt,
                updatedAt
            );

            // then
            expect(tag.content).toEqual(content);
            expect(tag.position).toEqual(position);
        });
    });

    describe('UpdatePosition', () => {
        const newPosition = Position.create(200, 200);
        it('태그가 삭제된 객체가 아니라면, 포지션 업데이트시 업데이트 된다.', () => {
            // given
            const tag = Tag.create(position, TagContent.create('태그'));
            const oldUpdatedAt = tag.updatedAt;
            jest.advanceTimersByTime(1000);

            // when
            tag.updatePosition(newPosition);

            // then
            expect(tag.position).toEqual(newPosition);
            expect(tag.updatedAt.getTime()).toBeGreaterThan(
                oldUpdatedAt.getTime()
            );
        });

        it('같은 포지션으로 업데이트시 에러를 던진다.', () => {
            // given
            const tag = Tag.create(position, TagContent.create('태그'));

            // when & then
            expect(() => tag.updatePosition(position)).toThrow(
                SamePositionException
            );
        });

        it('태그가 삭제된 객체라면, 포지션 업데이트시 에러를 던진다.', () => {
            // given
            const tag = Tag.create(position, TagContent.create('태그'));
            tag.delete();

            // when & then
            expect(() => tag.updatePosition(newPosition)).toThrow(
                DeletedTagException
            );
        });
    });

    describe('UpdateContent', () => {
        const oldContent = TagContent.create('태그');
        it('업데이트하려는 내용의 이전과 다르다면 업데이트 된다.', () => {
            // given
            const tag = Tag.create(position, oldContent);
            const newContent = TagContent.create('테스트');
            const oldUpdatedAt = tag.updatedAt;
            jest.advanceTimersByTime(1000);

            // when
            tag.updateContent(newContent);

            // then
            expect(tag.content).toEqual(newContent);
            expect(tag.updatedAt.getTime()).toBeGreaterThan(
                oldUpdatedAt.getTime()
            );
        });

        it('업데이트하려는 내용이 이전과 같으면 업데이트는 무시된다.', () => {
            // given
            const tag = Tag.create(position, oldContent);
            const oldUpdatedAt = tag.updatedAt;
            jest.advanceTimersByTime(1000);

            // when
            tag.updateContent(oldContent);

            // then
            expect(tag.content).toEqual(oldContent);
            expect(tag.updatedAt.getTime()).toBeGreaterThan(
                oldUpdatedAt.getTime()
            );
        });
    });

    describe('Delete', () => {
        it('태그가 삭제된 객체가 아니라면, 삭제된다.', () => {
            // given
            const tag = Tag.create(position, TagContent.create('태그'));

            // when
            tag.delete();

            // then
            expect(tag.isDeleted).toBeTruthy();
        });

        it('태그가 이미 삭제된 객체라면, 에러를 던진다.', () => {
            // given
            const tag = Tag.create(position, TagContent.create('태그'));
            tag.delete();

            // when & then
            expect(() => tag.delete()).toThrow(DeletedTagException);
        });
    });
});
