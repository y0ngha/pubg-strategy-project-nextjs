import { TeamPlayer } from '@domain/strategy/entities/team-player.entity';
import { Position } from '@domain/strategy/value-objects/position';
import { Marker } from '@domain/strategy/entities/marker.entity';
import { Waypoint } from '@domain/strategy/entities/waypoint.entity';
import {
    DeletedTeamPlayerException,
    InvalidTeamPlayerPriorityException,
    SamePositionException,
} from '@domain/strategy/exceptions/strategy.exceptions';
import { TeamPlayerId } from '@domain/strategy/value-objects/team-player-id';
import { PlayerColor } from '@domain/strategy/enums/player-color.enum';

describe('TeamPlayer', () => {
    const teamPlayerId = TeamPlayerId.generate();
    const position = Position.create(10, 20);
    const marker = Marker.create(position);
    const waypoint = Waypoint.create([position]);

    describe('Create', () => {
        it('Priority를 1~4 범위 내로 생성하면, 문제 없이 생성 된다.', () => {
            // given
            const priority = 1;
            const marker = Marker.create(position);
            const waypoint = Waypoint.create([position]);

            // when
            const teamPlayer = TeamPlayer.create(
                priority,
                position,
                marker,
                waypoint
            );

            // then
            expect(teamPlayer).toBeInstanceOf(TeamPlayer);
            expect(teamPlayer.priority).toBe(priority);
            expect(teamPlayer.position).toEqual(position);
            expect(teamPlayer.marker).toEqual(marker);
            expect(teamPlayer.waypoint).toEqual(waypoint);
        });

        it('Priority를 1~4 범위 내로 생성하고, Marker와 Waypoint는 NULL이 허용된다.', () => {
            // given
            const priority = 3;

            // when
            const teamPlayer = TeamPlayer.create(
                priority,
                position,
                null,
                null
            );

            // then
            expect(teamPlayer).toBeInstanceOf(TeamPlayer);
            expect(teamPlayer.priority).toBe(priority);
            expect(teamPlayer.position).toEqual(position);
            expect(teamPlayer.marker).toBeNull();
            expect(teamPlayer.waypoint).toBeNull();
        });

        it('Priority를 5로 생성하면, 에러를 던진다.', () => {
            // given
            const priority = 5;

            // when & then
            expect(() =>
                TeamPlayer.create(priority, position, null, null)
            ).toThrow(InvalidTeamPlayerPriorityException);
        });

        it('Priority를 0으로 생성하면, 에러를 던진다.', () => {
            // given
            const priority = 0;

            // when & then
            expect(() =>
                TeamPlayer.create(priority, position, null, null)
            ).toThrow(InvalidTeamPlayerPriorityException);
        });
    });

    describe('Reconstruct', () => {
        it('Priority를 1~4 범위 내로 생성하면, 문제 없이 재생성 된다.', () => {
            // given
            const priority = 1;

            // when
            const teamPlayer = TeamPlayer.reconstruct(
                teamPlayerId,
                priority,
                position,
                marker,
                waypoint,
                new Date(),
                new Date()
            );

            // then
            expect(teamPlayer).toBeInstanceOf(TeamPlayer);
            expect(teamPlayer.priority).toBe(priority);
            expect(teamPlayer.position).toEqual(position);
            expect(teamPlayer.marker).toEqual(marker);
            expect(teamPlayer.waypoint).toEqual(waypoint);
        });

        it('Priority를 1~4 범위 내로 생성하고, Marker와 Waypoint는 NULL이 허용된다.', () => {
            // given
            const priority = 2;

            // when
            const teamPlayer = TeamPlayer.reconstruct(
                teamPlayerId,
                priority,
                position,
                null,
                null,
                new Date(),
                new Date()
            );

            // then
            expect(teamPlayer).toBeInstanceOf(TeamPlayer);
            expect(teamPlayer.priority).toBe(priority);
            expect(teamPlayer.position).toEqual(position);
            expect(teamPlayer.marker).toBeNull();
            expect(teamPlayer.waypoint).toBeNull();
        });

        it('Priority를 5로 생성하면, 에러를 던진다.', () => {
            // given
            const priority = 5;

            // when & then
            expect(() =>
                TeamPlayer.reconstruct(
                    teamPlayerId,
                    priority,
                    position,
                    null,
                    null,
                    new Date(),
                    new Date()
                )
            ).toThrow(InvalidTeamPlayerPriorityException);
        });

        it('Priority를 0으로 생성하면, 에러를 던진다.', () => {
            // given
            const priority = 0;

            // when & then
            expect(() =>
                TeamPlayer.reconstruct(
                    teamPlayerId,
                    priority,
                    position,
                    null,
                    null,
                    new Date(),
                    new Date()
                )
            ).toThrow(InvalidTeamPlayerPriorityException);
        });
    });

    describe('Get Player Color', () => {
        it('TeamPlayer는 Priority에 따라 1 ~ 4까지 빨강 ~ 초록 색깔을 가진다.', () => {
            // given
            const teamPlayers = [1, 2, 3, 4].map(priority => {
                return TeamPlayer.create(priority, position, null, null);
            });

            // when & then
            expect(teamPlayers[0].color).toBe(PlayerColor.RED);
            expect(teamPlayers[1].color).toBe(PlayerColor.ORANGE);
            expect(teamPlayers[2].color).toBe(PlayerColor.YELLOW);
            expect(teamPlayers[3].color).toBe(PlayerColor.GREEN);
        });
    });

    describe('Update Position', () => {
        const newPosition = Position.create(30, 30);

        it('팀 플레이어가 삭제된 객체가 아니라면, 포지션 업데이트시 업데이트 된다.', () => {
            // given
            const teamPlayer = TeamPlayer.create(1, position, marker, waypoint);
            const oldUpdatedAt = teamPlayer.updatedAt;

            // when
            teamPlayer.updatePosition(newPosition);

            // then
            expect(teamPlayer.position).toEqual(newPosition);
            expect(teamPlayer.updatedAt).not.toBe(oldUpdatedAt);
        });

        it('같은 포지션으로 업데이트시 에러를 던진다.', () => {
            // given
            const teamPlayer = TeamPlayer.create(1, position, marker, waypoint);

            // when & then
            expect(() => teamPlayer.updatePosition(position)).toThrow(
                SamePositionException
            );
        });

        it('팀 플레이어가 삭제된 객체라면, 포지션 업데이트시 에러를 던진다.', () => {
            // given
            const teamPlayer = TeamPlayer.create(1, position, marker, waypoint);
            teamPlayer.delete();

            // when & then
            expect(() => teamPlayer.updatePosition(newPosition)).toThrow(
                DeletedTeamPlayerException
            );
        });
    });

    describe('Assign Marker', () => {
        const marker = Marker.create(Position.create(30, 30));

        it('팀 플레이어가 삭제된 객체가 아니라면, 마커를 연결할 수 있다.', () => {
            // given
            const teamPlayer = TeamPlayer.create(1, position, null, null);
            const oldUpdatedAt = teamPlayer.updatedAt;

            // when
            teamPlayer.assignMarker(marker);

            // then
            expect(teamPlayer.marker).toEqual(marker);
            expect(teamPlayer.updatedAt).not.toBe(oldUpdatedAt);
        });

        it('팀 플레이어가 삭제된 객체라면, 마커 연결시 에러를 던진다.', () => {
            // given
            const teamPlayer = TeamPlayer.create(1, position, null, null);
            teamPlayer.delete();

            // when & then
            expect(() => teamPlayer.assignMarker(marker)).toThrow(
                DeletedTeamPlayerException
            );
        });
    });

    describe('Clear Marker', () => {
        it('팀 플레이어가 삭제된 객체가 아니라면, 마커를 삭제할 수 있다.', () => {
            // given
            const teamPlayer = TeamPlayer.create(1, position, marker, null);
            const oldUpdatedAt = teamPlayer.updatedAt;

            // when
            teamPlayer.clearMarker();

            // then
            expect(teamPlayer.marker).toBeNull();
            expect(teamPlayer.updatedAt).not.toBe(oldUpdatedAt);
        });

        it('팀 플레이어가 삭제된 객체라면, 마커 삭제시 에러를 던진다.', () => {
            // given
            const teamPlayer = TeamPlayer.create(1, position, marker, null);
            teamPlayer.delete();

            // when & then
            expect(() => teamPlayer.clearMarker()).toThrow(
                DeletedTeamPlayerException
            );
        });
    });

    describe('Assign Waypoint', () => {
        const waypoint = Waypoint.create([Position.create(30, 30)]);

        it('팀 플레이어가 삭제된 객체가 아니라면, 웨이포인트를 연결할 수 있다.', () => {
            // given
            const teamPlayer = TeamPlayer.create(1, position, null, null);
            const oldUpdatedAt = teamPlayer.updatedAt;

            // when
            teamPlayer.assignWaypoint(waypoint);

            // then
            expect(teamPlayer.waypoint).toEqual(waypoint);
            expect(teamPlayer.updatedAt).not.toBe(oldUpdatedAt);
        });

        it('팀 플레이어가 삭제된 객체라면, 웨이포인트 연결시 에러를 던진다.', () => {
            // given
            const teamPlayer = TeamPlayer.create(1, position, null, null);
            teamPlayer.delete();

            // when & then
            expect(() => teamPlayer.assignWaypoint(waypoint)).toThrow(
                DeletedTeamPlayerException
            );
        });
    });

    describe('Clear Waypoint', () => {
        it('팀 플레이어가 삭제된 객체가 아니라면, 웨이포인트를 삭제할 수 있다.', () => {
            // given
            const teamPlayer = TeamPlayer.create(1, position, null, waypoint);
            const oldUpdatedAt = teamPlayer.updatedAt;

            // when
            teamPlayer.clearWaypoint();

            // then
            expect(teamPlayer.waypoint).toBeNull();
            expect(teamPlayer.updatedAt).not.toBe(oldUpdatedAt);
        });

        it('팀 플레이어가 삭제된 객체라면, 웨이포인트 삭제시 에러를 던진다.', () => {
            // given
            const teamPlayer = TeamPlayer.create(1, position, marker, null);
            teamPlayer.delete();

            // when & then
            expect(() => teamPlayer.clearWaypoint()).toThrow(
                DeletedTeamPlayerException
            );
        });
    });

    describe('Delete', () => {
        it('팀 플레이어가 삭제된 객체가 아니라면, 연결된 모든 리소스(마커, 웨이포인트)가 삭제되고 연결 해제된다.', () => {
            // given
            const marker = Marker.create(Position.create(10, 10));
            const waypoint = Waypoint.create([Position.create(10, 10)]);
            const teamPlayer = TeamPlayer.create(1, position, marker, waypoint);

            // when
            teamPlayer.delete();

            // then
            expect(teamPlayer.marker).toBeNull();
            expect(marker.isDeleted).toBeTruthy();
            expect(teamPlayer.waypoint).toBeNull();
            expect(waypoint.isDeleted).toBeTruthy();
            expect(teamPlayer.isDeleted).toBeTruthy();
        });

        it('팀 플레이어가 삭제된 객체라면, 삭제시 에러를 던진다.', () => {
            // given
            const teamPlayer = TeamPlayer.create(1, position, marker, waypoint);
            teamPlayer.delete();

            // when & then
            expect(() => teamPlayer.delete()).toThrow(
                DeletedTeamPlayerException
            );
        });
    });
});
