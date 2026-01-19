import { TeamPlayer } from '@domain/strategy/entities/team-player.entity';
import { Position } from '@domain/strategy/value-objects/position';
import { Marker } from '@domain/strategy/entities/marker.entity';
import { Waypoint } from '@domain/strategy/entities/waypoint.entity';
import {
    DeletedTeamPlayerException,
    InvalidTeamPlayerPriorityException,
    MarkerExistsException,
    MarkerNotFoundException,
    WaypointNotFoundException,
} from '@domain/strategy/exceptions/strategy.exceptions';
import { TeamPlayerId } from '@domain/strategy/value-objects/team-player-id';
import { PlayerColor } from '@domain/strategy/enums/player-color.enum';

describe('TeamPlayer', () => {
    const teamPlayerId = TeamPlayerId.generate();
    const position = Position.create(10, 20);
    let marker: Marker;
    let waypoint: Waypoint;

    beforeEach(() => {
        marker = Marker.create(position);
        waypoint = Waypoint.create([position]);

        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.useRealTimers();
    });

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
        it('재생성되는 값을 그대로 신뢰하여 유효성 검사 없이 생성된다.', () => {
            // given
            const priority = 100;
            const createdAt = new Date('2000-01-01');
            const updatedAt = new Date('2026-01-01');

            // when
            const teamPlayer = TeamPlayer.reconstruct(
                teamPlayerId,
                priority,
                position,
                marker,
                waypoint,
                createdAt,
                updatedAt
            );

            // then
            expect(teamPlayer).toBeInstanceOf(TeamPlayer);
            expect(teamPlayer.id).toEqual(teamPlayerId);
            expect(teamPlayer.priority).toEqual(priority);
            expect(teamPlayer.position).toEqual(position);
            expect(teamPlayer.marker).toEqual(marker);
            expect(teamPlayer.waypoint).toEqual(waypoint);
            expect(teamPlayer.createdAt).toEqual(createdAt);
            expect(teamPlayer.updatedAt).toEqual(updatedAt);
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
            jest.advanceTimersByTime(1000);

            // when
            teamPlayer.updatePosition(newPosition);

            // then
            expect(teamPlayer.position).toEqual(newPosition);
            expect(teamPlayer.updatedAt.getTime()).toBeGreaterThan(
                oldUpdatedAt.getTime()
            );
        });

        it('같은 포지션으로 업데이트시 무시된다.', () => {
            // given
            const teamPlayer = TeamPlayer.create(1, position, marker, waypoint);
            const oldUpdatedAt = teamPlayer.updatedAt;
            jest.advanceTimersByTime(1000);

            // when
            teamPlayer.updatePosition(position);

            // then
            expect(teamPlayer.updatedAt.getTime()).toEqual(
                oldUpdatedAt.getTime()
            );
            expect(teamPlayer.position).toEqual(position);
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

    describe('Add Marker', () => {
        const markerPosition = Position.create(30, 30);

        it('팀 플레이어가 삭제된 객체가 아니라면, 마커를 추가할 수 있다.', () => {
            // given
            const teamPlayer = TeamPlayer.create(1, position, null, null);
            const oldUpdatedAt = teamPlayer.updatedAt;
            jest.advanceTimersByTime(1000);

            // when
            teamPlayer.addMarker(markerPosition);

            // then
            expect(teamPlayer.marker?.position).toEqual(markerPosition);
            expect(teamPlayer.updatedAt.getTime()).toBeGreaterThan(
                oldUpdatedAt.getTime()
            );
        });

        it('이미 마커가 있을 경우, 에러를 던진다.', () => {
            // given
            const teamPlayer = TeamPlayer.create(1, position, null, null);
            teamPlayer.addMarker(markerPosition);

            // when & then
            expect(() => teamPlayer.addMarker(markerPosition)).toThrow(
                MarkerExistsException
            );
        });

        it('팀 플레이어가 삭제된 객체라면, 마커 추가시 에러를 던진다.', () => {
            // given
            const teamPlayer = TeamPlayer.create(1, position, null, null);
            teamPlayer.delete();

            // when & then
            expect(() => teamPlayer.addMarker(markerPosition)).toThrow(
                DeletedTeamPlayerException
            );
        });
    });

    describe('Update Marker Position', () => {
        const oldPosition = Position.create(30, 30);

        it('팀 플레이어가 삭제된 객체가 아니고, 마커가 있으면 마커를 수정할 수 있다.', () => {
            // given
            const teamPlayer = TeamPlayer.create(1, position, null, null);
            const newPosition = Position.create(500, 500);
            const oldUpdatedAt = teamPlayer.updatedAt;
            teamPlayer.addMarker(oldPosition);
            jest.advanceTimersByTime(1000);

            // when
            teamPlayer.updateMarkerPosition(newPosition);

            // then
            expect(teamPlayer.marker?.position).toEqual(newPosition);
            expect(teamPlayer.updatedAt.getTime()).toBeGreaterThan(
                oldUpdatedAt.getTime()
            );
        });

        it('마커가 없을 경우, 에러를 던진다.', () => {
            // given
            const teamPlayer = TeamPlayer.create(1, position, null, null);
            const newPosition = Position.create(500, 500);
            // when & then
            expect(() => teamPlayer.updateMarkerPosition(newPosition)).toThrow(
                MarkerNotFoundException
            );
        });

        it('팀 플레이어가 삭제된 객체라면, 마커 수정시 에러를 던진다.', () => {
            // given
            const teamPlayer = TeamPlayer.create(1, position, null, null);
            const newPosition = Position.create(500, 500);
            teamPlayer.delete();

            // when & then
            expect(() => teamPlayer.updateMarkerPosition(newPosition)).toThrow(
                DeletedTeamPlayerException
            );
        });
    });

    describe('Delete Marker', () => {
        it('팀 플레이어가 삭제된 객체가 아니라면, 마커를 삭제할 수 있다.', () => {
            // given
            const teamPlayer = TeamPlayer.create(1, position, marker, null);
            const oldUpdatedAt = teamPlayer.updatedAt;
            jest.advanceTimersByTime(1000);

            // when
            teamPlayer.deleteMarker();

            // then
            expect(teamPlayer.marker).toBeNull();
            expect(teamPlayer.updatedAt.getTime()).toBeGreaterThan(
                oldUpdatedAt.getTime()
            );
        });

        it('팀 플레이어가 삭제된 객체라면, 마커 삭제시 에러를 던진다.', () => {
            // given
            const teamPlayer = TeamPlayer.create(1, position, marker, null);
            teamPlayer.delete();

            // when & then
            expect(() => teamPlayer.deleteMarker()).toThrow(
                DeletedTeamPlayerException
            );
        });
    });

    describe('Add Waypoint', () => {
        const waypointPositions = [Position.create(30, 30)];

        it('팀 플레이어가 삭제된 객체가 아니라면, 웨이포인트를 추가할 수 있다.', () => {
            // given
            const teamPlayer = TeamPlayer.create(1, position, null, null);
            const oldUpdatedAt = teamPlayer.updatedAt;
            jest.advanceTimersByTime(1000);

            // when
            teamPlayer.addWaypoint(waypointPositions);

            // then
            expect(teamPlayer.waypoint?.positions).toEqual(waypointPositions);
            expect(teamPlayer.updatedAt.getTime()).toBeGreaterThan(
                oldUpdatedAt.getTime()
            );
        });

        it('팀 플레이어가 삭제된 객체라면, 웨이포인트 추가시 에러를 던진다.', () => {
            // given
            const teamPlayer = TeamPlayer.create(1, position, null, null);
            teamPlayer.delete();

            // when & then
            expect(() => teamPlayer.addWaypoint(waypointPositions)).toThrow(
                DeletedTeamPlayerException
            );
        });
    });

    describe('Update Waypoint Positions', () => {
        const oldPositions = [Position.create(30, 30)];

        it('팀 플레이어가 삭제된 객체가 아니고, 웨이포인트가 있으면 웨이포인트를 수정할 수 있다.', () => {
            // given
            const teamPlayer = TeamPlayer.create(1, position, null, null);
            teamPlayer.addWaypoint(oldPositions);
            const newPositions = [Position.create(500, 500)];
            const oldUpdatedAt = teamPlayer.updatedAt;

            jest.advanceTimersByTime(1000);

            // when
            teamPlayer.updateWaypointPositions(newPositions);

            // then
            expect(teamPlayer.waypoint?.positions).toEqual(newPositions);
            expect(teamPlayer.updatedAt.getTime()).toBeGreaterThan(
                oldUpdatedAt.getTime()
            );
        });

        it('웨이포인트가 없을 경우, 에러를 던진다.', () => {
            // given
            const teamPlayer = TeamPlayer.create(1, position, null, null);
            const newPositions = [Position.create(500, 500)];

            // when & then
            expect(() =>
                teamPlayer.updateWaypointPositions(newPositions)
            ).toThrow(WaypointNotFoundException);
        });

        it('팀 플레이어가 삭제된 객체라면, 웨이포인트 수정시 에러를 던진다.', () => {
            // given
            const teamPlayer = TeamPlayer.create(1, position, null, null);
            const newPositions = [Position.create(500, 500)];
            teamPlayer.delete();

            // when & then
            expect(() =>
                teamPlayer.updateWaypointPositions(newPositions)
            ).toThrow(DeletedTeamPlayerException);
        });
    });

    describe('Delete Waypoint', () => {
        it('팀 플레이어가 삭제된 객체가 아니라면, 웨이포인트를 삭제할 수 있다.', () => {
            // given
            const teamPlayer = TeamPlayer.create(1, position, null, waypoint);
            const oldUpdatedAt = teamPlayer.updatedAt;
            jest.advanceTimersByTime(1000);

            // when
            teamPlayer.deleteWaypoint();

            // then
            expect(teamPlayer.waypoint).toBeNull();
            expect(teamPlayer.updatedAt.getTime()).toBeGreaterThan(
                oldUpdatedAt.getTime()
            );
        });

        it('팀 플레이어가 삭제된 객체라면, 웨이포인트 삭제시 에러를 던진다.', () => {
            // given
            const teamPlayer = TeamPlayer.create(1, position, marker, null);
            teamPlayer.delete();

            // when & then
            expect(() => teamPlayer.deleteWaypoint()).toThrow(
                DeletedTeamPlayerException
            );
        });
    });

    describe('Delete', () => {
        it('팀 플레이어가 삭제된 객체가 아니라면, 추가된 모든 리소스(마커, 웨이포인트)가 삭제되고 추가 해제된다.', () => {
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
