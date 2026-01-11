import { UserId } from '@domain/shared/value-objects/user-id';
import { Email } from '@domain/shared/value-objects/email';
import { PubgMap } from '@domain/strategy/enums/map.enum';
import { Strategy } from '@domain/strategy/entities/strategy.entity';
import { TeamPlayer } from '@domain/strategy/entities/team-player.entity';
import { EnemyTeam } from '@domain/strategy/entities/enemy-team.entity';
import { Circle } from '@domain/strategy/entities/circle.entity';
import { Tag } from '@domain/strategy/entities/tag.entity';
import { StrategyShare } from '@domain/strategy/entities/strategy-share.entity';
import { Comment } from '@domain/strategy/entities/comment.entity';
import { StrategyId } from '@domain/strategy/value-objects/strategy-id';
import { Position } from '@domain/strategy/value-objects/position';
import { TeamLabel } from '@domain/strategy/value-objects/team-label';
import { AirplanePath } from '@domain/strategy/entities/airplane-path.entity';
import { StrategySharePermission } from '@domain/strategy/enums/strategy-share-permission.enum';
import { CommentContent } from '@domain/strategy/value-objects/comment-content';
import {
    ChildCommentException,
    CircleLimitExceededException,
    CirclePhaseDuplicateException,
    CommentNotFoundException,
    DeletedStrategyException,
    InvalidAuthorException,
    StrategyEditPermissionDeniedException,
    StrategyPermissionDeniedException,
    StrategyShareDuplicateException,
    StrategyShareSelfDeniedException,
    TeamPlayerBelowMinimumException,
    TeamPlayerLimitExceededException,
} from '@domain/strategy/exceptions/strategy.exceptions';
import { CommentId } from '@domain/strategy/value-objects/comment-id';

describe('Strategy', () => {
    const ownerId = UserId.generate();
    const editorId = UserId.generate();
    const viewerId = UserId.generate();
    const strangerId = UserId.generate();

    const ownerEmail = Email.create('owner@test.com');
    const editorEmail = Email.create('editor@test.com');
    const viewerEmail = Email.create('viewer@test.com');
    const strangerEmail = Email.create('stranger@test.com');

    let teamPlayer1Fixture: TeamPlayer;
    let teamPlayer2Fixture: TeamPlayer;
    let teamPlayer3Fixture: TeamPlayer;
    let teamPlayer4Fixture: TeamPlayer;

    let enemyTeam1Fixture: EnemyTeam;
    let enemyTeam2Fixture: EnemyTeam;
    let enemyTeam3Fixture: EnemyTeam;
    let enemyTeam4Fixture: EnemyTeam;

    let circle1Fixture: Circle;
    let circle2Fixture: Circle;

    let airplanePath: AirplanePath;

    let tagFixture: Tag;

    let strategyShareEditorFixture: StrategyShare;
    let strategyShareViewerFixture: StrategyShare;

    let parentCommentFixutre: Comment;
    let childCommentFixutre1: Comment;
    let childCommentFixutre2: Comment;

    let strategyFixture: Strategy;

    const defaultTitle = '전략';
    const defaultMap = PubgMap.ERANGEL;

    beforeEach(() => {
        teamPlayer1Fixture = TeamPlayer.create(
            1,
            Position.create(10, 10),
            null,
            null
        );
        teamPlayer2Fixture = TeamPlayer.create(
            2,
            Position.create(100, 10),
            null,
            null
        );
        teamPlayer3Fixture = TeamPlayer.create(
            3,
            Position.create(1000, 10),
            null,
            null
        );
        teamPlayer4Fixture = TeamPlayer.create(
            4,
            Position.create(10000, 10),
            null,
            null
        );

        enemyTeam1Fixture = EnemyTeam.create(
            TeamLabel.create('A'),
            Position.create(10, 10)
        );
        enemyTeam2Fixture = EnemyTeam.create(
            TeamLabel.create('B'),
            Position.create(100, 10)
        );
        enemyTeam3Fixture = EnemyTeam.create(
            TeamLabel.create('C'),
            Position.create(1000, 10)
        );
        enemyTeam4Fixture = EnemyTeam.create(
            TeamLabel.create('D'),
            Position.create(10000, 10)
        );

        circle1Fixture = Circle.create(Position.create(500, 500), 1);
        circle2Fixture = Circle.create(Position.create(250, 250), 2);

        airplanePath = AirplanePath.create(
            Position.create(0, 0),
            Position.create(100, 100)
        );

        tagFixture = Tag.create(Position.create(10, 10), '태그');

        strategyShareEditorFixture = StrategyShare.create(
            editorId,
            editorEmail,
            StrategySharePermission.EDITABLE
        );
        strategyShareViewerFixture = StrategyShare.create(
            editorId,
            editorEmail,
            StrategySharePermission.READ_ONLY
        );

        parentCommentFixutre = Comment.create(
            Position.create(10, 10),
            ownerId,
            ownerEmail,
            CommentContent.create('테스트'),
            null
        );
        childCommentFixutre1 = Comment.create(
            Position.create(10, 10),
            editorId,
            editorEmail,
            CommentContent.create('자식1'),
            parentCommentFixutre.id
        );
        childCommentFixutre2 = Comment.create(
            Position.create(10, 10),
            viewerId,
            viewerEmail,
            CommentContent.create('자식2'),
            parentCommentFixutre.id
        );

        strategyFixture = Strategy.reconstruct(
            StrategyId.generate(),
            ownerId,
            defaultTitle,
            defaultMap,
            [
                teamPlayer1Fixture,
                teamPlayer2Fixture,
                teamPlayer3Fixture,
                teamPlayer4Fixture,
            ],
            [
                enemyTeam1Fixture,
                enemyTeam2Fixture,
                enemyTeam3Fixture,
                enemyTeam4Fixture,
            ],
            [circle1Fixture, circle2Fixture],
            airplanePath,
            [tagFixture],
            [strategyShareEditorFixture, strategyShareViewerFixture],
            [parentCommentFixutre, childCommentFixutre1, childCommentFixutre2],
            false,
            new Date(),
            new Date()
        );
    });

    describe('Create', () => {
        it('최초 생성시 기본값이 잘 들어간 채로 생성된다.', () => {
            // when
            const strategy = Strategy.create(ownerId, defaultTitle, defaultMap);

            // then
            expect(strategy.title).toBe(defaultTitle);
            expect(strategy.map).toBe(defaultMap);
            expect(strategy.teamPlayers).toHaveLength(1);
            expect(strategy.enemyTeams).toEqual([]);
            expect(strategy.circles).toEqual([]);
            expect(strategy.airplanePath).toBeNull();
            expect(strategy.tags).toEqual([]);
            expect(strategy.shares).toEqual([]);
            expect(strategy.comments).toEqual([]);
        });
    });

    describe('Reconstruct', () => {
        it('재구성시 재구성된 값이 잘 들어간 채로 생성된다.', () => {
            // given
            const teamPlayers = [
                teamPlayer1Fixture,
                teamPlayer2Fixture,
                teamPlayer3Fixture,
                teamPlayer4Fixture,
            ];

            const enemyTeams = [
                enemyTeam1Fixture,
                enemyTeam2Fixture,
                enemyTeam3Fixture,
                enemyTeam4Fixture,
            ];

            const circles = [circle1Fixture, circle2Fixture];

            const tags = [tagFixture];

            const shares = [
                strategyShareEditorFixture,
                strategyShareViewerFixture,
            ];

            const comments = [
                parentCommentFixutre,
                childCommentFixutre1,
                childCommentFixutre2,
            ];

            // when
            const strategy = Strategy.reconstruct(
                StrategyId.generate(),
                ownerId,
                defaultTitle,
                defaultMap,
                teamPlayers,
                enemyTeams,
                circles,
                airplanePath,
                tags,
                shares,
                comments,
                false,
                new Date(),
                new Date()
            );

            // then
            expect(strategy.ownerId).toBe(ownerId);
            expect(strategy.title).toBe(defaultTitle);
            expect(strategy.map).toBe(defaultMap);
            expect(strategy.teamPlayers).toEqual(teamPlayers);
            expect(strategy.enemyTeams).toEqual(enemyTeams);
            expect(strategy.circles).toEqual(circles);
            expect(strategy.airplanePath).toBe(airplanePath);
            expect(strategy.tags).toEqual(tags);
            expect(strategy.shares).toEqual(shares);
            expect(strategy.comments).toEqual(comments);
        });
    });

    describe('Delete', () => {
        it('삭제가 되지 않은 객체이고, 전략 소유주라면 삭제된다.', () => {
            // give
            const strategy = Strategy.create(ownerId, defaultTitle, defaultMap);

            // when
            strategy.delete(ownerId);

            // then
            expect(strategy.isDeleted).toBeTruthy();
        });

        it('전략 소유주가 아니면 에러를 던진다.', () => {
            // give
            const strategy = Strategy.create(ownerId, defaultTitle, defaultMap);

            // when & then
            expect(() => strategy.delete(editorId)).toThrow(
                StrategyPermissionDeniedException
            );
            expect(() => strategy.delete(viewerId)).toThrow(
                StrategyPermissionDeniedException
            );
            expect(() => strategy.delete(strangerId)).toThrow(
                StrategyPermissionDeniedException
            );
        });

        it('이미 삭제된 객체라면, 에러를 던진다.', () => {
            // give
            const strategy = Strategy.create(ownerId, defaultTitle, defaultMap);
            strategy.delete(ownerId);

            // when & then
            expect(() => strategy.delete(ownerId)).toThrow(
                DeletedStrategyException
            );
        });
    });

    describe('TeamPlayer', () => {
        describe('AddTeamPlayer', () => {
            it('팀 플레이어가 4명 이하이고, 편집 권한이 있으면 추가된다.', () => {
                // given
                const strategy = Strategy.create(
                    ownerId,
                    defaultTitle,
                    defaultMap
                );
                strategy.addStrategyShare(
                    ownerId,
                    editorId,
                    editorEmail,
                    StrategySharePermission.EDITABLE
                );

                // when
                strategy.addTeamPlayer(editorId);
                strategy.addTeamPlayer(ownerId);

                // then
                expect(strategy.teamPlayers).toHaveLength(3);
            });

            it('팀 플레이어가 4명 이상이면, 추가시 에러를 던진다.', () => {
                // given
                const strategy = Strategy.create(
                    ownerId,
                    defaultTitle,
                    defaultMap
                );

                strategy.addTeamPlayer(ownerId);
                strategy.addTeamPlayer(ownerId);
                strategy.addTeamPlayer(ownerId);

                // when & then
                expect(() => strategy.addTeamPlayer(ownerId)).toThrow(
                    TeamPlayerLimitExceededException
                );
            });

            it('전략에 대한 편집 권한이 없으면, 에러를 던진다.', () => {
                // when & then
                expect(() => strategyFixture.addTeamPlayer(viewerId)).toThrow(
                    StrategyEditPermissionDeniedException
                );
                expect(() => strategyFixture.addTeamPlayer(strangerId)).toThrow(
                    StrategyEditPermissionDeniedException
                );
            });

            it('삭제된 전략이라면, 에러를 던진다.', () => {
                // give
                strategyFixture.delete(ownerId);

                // when & then
                expect(() => strategyFixture.addTeamPlayer(ownerId)).toThrow(
                    DeletedStrategyException
                );
            });
        });
        describe('RemoveTeamPlayer', () => {
            it('전략에 대한 편집 권한이 있으면 삭제된다.', () => {
                // give
                const teamPlayerId1 = teamPlayer1Fixture.id;
                const teamPlayerId2 = teamPlayer2Fixture.id;

                // when
                strategyFixture.removeTeamPlayer(editorId, teamPlayerId1);
                strategyFixture.removeTeamPlayer(ownerId, teamPlayerId2);

                // then
                const teamPlayerIds = strategyFixture.teamPlayers.map(
                    teamPlayer => teamPlayer.id
                );

                expect(teamPlayerIds.includes(teamPlayerId1)).toBeFalsy();
                expect(teamPlayerIds.includes(teamPlayerId2)).toBeFalsy();
            });

            it('팀 플레이어가 1명일 때 삭제하면 에러를 던진다.', () => {
                // give
                const strategy = Strategy.create(
                    ownerId,
                    defaultTitle,
                    defaultMap
                );

                const teamPlayerId = strategy.teamPlayers[0].id;

                // when & then
                expect(() =>
                    strategy.removeTeamPlayer(ownerId, teamPlayerId)
                ).toThrow(TeamPlayerBelowMinimumException);
            });

            it('전략에 대한 편집 권한이 없으면, 에러를 던진다.', () => {
                // give
                const teamPlayerId = teamPlayer1Fixture.id;

                // when & then
                expect(() =>
                    strategyFixture.removeTeamPlayer(viewerId, teamPlayerId)
                ).toThrow(StrategyEditPermissionDeniedException);

                expect(() =>
                    strategyFixture.removeTeamPlayer(strangerId, teamPlayerId)
                ).toThrow(StrategyEditPermissionDeniedException);
            });

            it('삭제된 전략이라면, 에러를 던진다.', () => {
                // give
                const teamPlayerId = teamPlayer1Fixture.id;
                strategyFixture.delete(ownerId);

                // when & then
                expect(() =>
                    strategyFixture.removeTeamPlayer(ownerId, teamPlayerId)
                ).toThrow(DeletedStrategyException);
            });
        });

        describe('UpdateTeamPlayerPosition', () => {
            const newPosition = Position.create(1500, 1500);
            it('전략에 대한 편집 권한이 있으면, 업데이트 된다.', () => {
                // given
                const teamPlayerId1 = teamPlayer1Fixture.id;
                const teamPlayerId2 = teamPlayer2Fixture.id;

                const oldTeamPlayer1Position = teamPlayer1Fixture.position;
                const oldTeamPlayer2Position = teamPlayer2Fixture.position;

                // when
                strategyFixture.updateTeamPlayerPosition(
                    ownerId,
                    teamPlayerId1,
                    newPosition
                );
                strategyFixture.updateTeamPlayerPosition(
                    editorId,
                    teamPlayerId2,
                    newPosition
                );

                // then
                expect(teamPlayer1Fixture.position).not.toEqual(
                    oldTeamPlayer1Position
                );
                expect(teamPlayer1Fixture.position).toEqual(newPosition);
                expect(teamPlayer2Fixture.position).not.toEqual(
                    oldTeamPlayer2Position
                );
                expect(teamPlayer2Fixture.position).toEqual(newPosition);
            });

            it('전략에 대한 편집 권한이 없으면, 에러를 던진다.', () => {
                // give
                const teamPlayerId = teamPlayer1Fixture.id;

                // when & then
                expect(() =>
                    strategyFixture.updateTeamPlayerPosition(
                        viewerId,
                        teamPlayerId,
                        newPosition
                    )
                ).toThrow(StrategyEditPermissionDeniedException);

                expect(() =>
                    strategyFixture.updateTeamPlayerPosition(
                        strangerId,
                        teamPlayerId,
                        newPosition
                    )
                ).toThrow(StrategyEditPermissionDeniedException);
            });

            it('삭제된 전략이라면, 에러를 던진다.', () => {
                // give
                const teamPlayerId = teamPlayer1Fixture.id;
                strategyFixture.delete(ownerId);

                // when & then
                expect(() =>
                    strategyFixture.updateTeamPlayerPosition(
                        ownerId,
                        teamPlayerId,
                        newPosition
                    )
                ).toThrow(DeletedStrategyException);
            });
        });

        describe('AddTeamPlayerMarker', () => {
            const markerPosition = Position.create(15, 15);
            it('전략에 대한 편집 권한이 있으면, 마커가 추가된다.', () => {
                // given
                const teamPlayerId1 = teamPlayer1Fixture.id;
                const teamPlayerId2 = teamPlayer2Fixture.id;

                // when
                strategyFixture.addTeamPlayerMarker(
                    ownerId,
                    teamPlayerId1,
                    markerPosition
                );
                strategyFixture.addTeamPlayerMarker(
                    editorId,
                    teamPlayerId2,
                    markerPosition
                );

                // then
                expect(teamPlayer1Fixture.marker).not.toBeNull();
                expect(teamPlayer1Fixture.marker?.position).toEqual(
                    markerPosition
                );

                expect(teamPlayer2Fixture.marker).not.toBeNull();
                expect(teamPlayer2Fixture.marker?.position).toEqual(
                    markerPosition
                );
            });

            it('전략에 대한 편집 권한이 없으면, 에러를 던진다.', () => {
                // give
                const teamPlayerId = teamPlayer1Fixture.id;

                // when & then
                expect(() =>
                    strategyFixture.addTeamPlayerMarker(
                        viewerId,
                        teamPlayerId,
                        markerPosition
                    )
                ).toThrow(StrategyEditPermissionDeniedException);

                expect(() =>
                    strategyFixture.addTeamPlayerMarker(
                        strangerId,
                        teamPlayerId,
                        markerPosition
                    )
                ).toThrow(StrategyEditPermissionDeniedException);
            });

            it('삭제된 전략이라면, 에러를 던진다.', () => {
                // give
                const teamPlayerId = teamPlayer1Fixture.id;
                strategyFixture.delete(ownerId);

                // when & then
                expect(() =>
                    strategyFixture.addTeamPlayerMarker(
                        ownerId,
                        teamPlayerId,
                        markerPosition
                    )
                ).toThrow(DeletedStrategyException);
            });
        });

        describe('RemoveTeamPlayerMarker', () => {
            it('전략에 대한 편집 권한이 있으면, 마커가 삭제된다.', () => {
                // given
                const markerPosition = Position.create(15, 15);
                const teamPlayerId1 = teamPlayer1Fixture.id;
                const teamPlayerId2 = teamPlayer2Fixture.id;
                strategyFixture.addTeamPlayerMarker(
                    ownerId,
                    teamPlayerId1,
                    markerPosition
                );
                strategyFixture.addTeamPlayerMarker(
                    editorId,
                    teamPlayerId2,
                    markerPosition
                );

                // when
                strategyFixture.removeTeamPlayerMarker(ownerId, teamPlayerId1);
                strategyFixture.removeTeamPlayerMarker(editorId, teamPlayerId2);

                // then
                expect(teamPlayer1Fixture.marker).toBeNull();
                expect(teamPlayer2Fixture.marker).toBeNull();
            });

            it('전략에 대한 편집 권한이 없으면, 에러를 던진다.', () => {
                // give
                const teamPlayerId = teamPlayer1Fixture.id;

                // when & then
                expect(() =>
                    strategyFixture.removeTeamPlayerMarker(
                        viewerId,
                        teamPlayerId
                    )
                ).toThrow(StrategyEditPermissionDeniedException);

                expect(() =>
                    strategyFixture.removeTeamPlayerMarker(
                        strangerId,
                        teamPlayerId
                    )
                ).toThrow(StrategyEditPermissionDeniedException);
            });
            it('삭제된 전략이라면, 에러를 던진다.', () => {
                // give
                const teamPlayerId = teamPlayer1Fixture.id;
                strategyFixture.delete(ownerId);

                // when & then
                expect(() =>
                    strategyFixture.removeTeamPlayerMarker(
                        ownerId,
                        teamPlayerId
                    )
                ).toThrow(DeletedStrategyException);
            });
        });

        describe('AddTeamPlayerWaypoint', () => {
            const waypointPositions = [
                Position.create(1, 1),
                Position.create(1, 2),
                Position.create(1, 3),
            ];

            it('전략에 대한 편집 권한이 있으면, 웨이포인트가 추가된다.', () => {
                // given
                const teamPlayerId1 = teamPlayer1Fixture.id;
                const teamPlayerId2 = teamPlayer2Fixture.id;

                // when
                strategyFixture.addTeamPlayerWaypoint(
                    ownerId,
                    teamPlayerId1,
                    waypointPositions
                );
                strategyFixture.addTeamPlayerWaypoint(
                    editorId,
                    teamPlayerId2,
                    waypointPositions
                );

                // then
                expect(teamPlayer1Fixture.waypoint).not.toBeNull();
                expect(teamPlayer1Fixture.waypoint?.positions).toEqual(
                    waypointPositions
                );

                expect(teamPlayer2Fixture.waypoint).not.toBeNull();
                expect(teamPlayer2Fixture.waypoint?.positions).toEqual(
                    waypointPositions
                );
            });

            it('전략에 대한 편집 권한이 없으면, 에러를 던진다.', () => {
                // give
                const teamPlayerId = teamPlayer1Fixture.id;

                // when & then
                expect(() =>
                    strategyFixture.addTeamPlayerWaypoint(
                        viewerId,
                        teamPlayerId,
                        waypointPositions
                    )
                ).toThrow(StrategyEditPermissionDeniedException);

                expect(() =>
                    strategyFixture.addTeamPlayerWaypoint(
                        strangerId,
                        teamPlayerId,
                        waypointPositions
                    )
                ).toThrow(StrategyEditPermissionDeniedException);
            });

            it('삭제된 전략이라면, 에러를 던진다.', () => {
                // give
                const teamPlayerId = teamPlayer1Fixture.id;
                strategyFixture.delete(ownerId);

                // when & then
                expect(() =>
                    strategyFixture.addTeamPlayerWaypoint(
                        ownerId,
                        teamPlayerId,
                        waypointPositions
                    )
                ).toThrow(DeletedStrategyException);
            });
        });
        describe('RemoveTeamPlayerWaypoint', () => {
            it('전략에 대한 편집 권한이 있으면, 웨이포인트가 삭제된다.', () => {
                // given
                const waypointPositions = [
                    Position.create(1, 1),
                    Position.create(1, 2),
                    Position.create(1, 3),
                ];
                const teamPlayerId1 = teamPlayer1Fixture.id;
                const teamPlayerId2 = teamPlayer2Fixture.id;
                strategyFixture.addTeamPlayerWaypoint(
                    ownerId,
                    teamPlayerId1,
                    waypointPositions
                );
                strategyFixture.addTeamPlayerWaypoint(
                    editorId,
                    teamPlayerId2,
                    waypointPositions
                );

                // when
                strategyFixture.removeTeamPlayerWaypoint(
                    ownerId,
                    teamPlayerId1
                );
                strategyFixture.removeTeamPlayerWaypoint(
                    editorId,
                    teamPlayerId2
                );

                // then
                expect(teamPlayer1Fixture.waypoint).toBeNull();
                expect(teamPlayer2Fixture.waypoint).toBeNull();
            });

            it('전략에 대한 편집 권한이 없으면, 에러를 던진다.', () => {
                // give
                const teamPlayerId = teamPlayer1Fixture.id;

                // when & then
                expect(() =>
                    strategyFixture.removeTeamPlayerWaypoint(
                        viewerId,
                        teamPlayerId
                    )
                ).toThrow(StrategyEditPermissionDeniedException);

                expect(() =>
                    strategyFixture.removeTeamPlayerWaypoint(
                        strangerId,
                        teamPlayerId
                    )
                ).toThrow(StrategyEditPermissionDeniedException);
            });
            it('삭제된 전략이라면, 에러를 던진다.', () => {
                // give
                const teamPlayerId = teamPlayer1Fixture.id;
                strategyFixture.delete(ownerId);

                // when & then
                expect(() =>
                    strategyFixture.removeTeamPlayerWaypoint(
                        ownerId,
                        teamPlayerId
                    )
                ).toThrow(DeletedStrategyException);
            });
        });
    });

    describe('EnemyTeam', () => {
        const teamLabel = TeamLabel.create('A');

        describe('AddEnemyTeam', () => {
            it('전략에 대한 편집 권한이 있으면, 적 팀이 추가된다.', () => {
                // given
                const teamLabel1 = TeamLabel.create('A');
                const teamLabel2 = TeamLabel.create('B');

                const strategy = Strategy.create(
                    ownerId,
                    defaultTitle,
                    defaultMap
                );
                strategy.addStrategyShare(
                    ownerId,
                    editorId,
                    editorEmail,
                    StrategySharePermission.EDITABLE
                );

                // when
                strategy.addEnemyTeam(ownerId, teamLabel1);
                strategy.addEnemyTeam(editorId, teamLabel2);

                // then
                const teamLabels = strategy.enemyTeams.map(
                    enemyTeam => enemyTeam.teamLabel
                );
                expect(strategy.enemyTeams).toHaveLength(2);
                expect(teamLabels.includes(teamLabel1)).toBeTruthy();
                expect(teamLabels.includes(teamLabel2)).toBeTruthy();
            });

            it('전략에 대한 편집 권한이 없으면, 에러를 던진다.', () => {
                // when & then
                expect(() =>
                    strategyFixture.addEnemyTeam(viewerId, teamLabel)
                ).toThrow(StrategyEditPermissionDeniedException);

                expect(() =>
                    strategyFixture.addEnemyTeam(strangerId, teamLabel)
                ).toThrow(StrategyEditPermissionDeniedException);
            });

            it('삭제된 전략이라면, 에러를 던진다.', () => {
                // give
                strategyFixture.delete(ownerId);

                // when & then
                expect(() =>
                    strategyFixture.addEnemyTeam(ownerId, teamLabel)
                ).toThrow(DeletedStrategyException);
            });
        });

        describe('RemoveEnemyTeam', () => {
            it('전략에 대한 편집 권한이 있으면, 적 팀은 삭제된다.', () => {
                // given
                const enemyTeamId1 = enemyTeam1Fixture.id;
                const enemyTeamId2 = enemyTeam2Fixture.id;

                // when
                strategyFixture.removeEnemyTeam(ownerId, enemyTeamId1);
                strategyFixture.removeEnemyTeam(editorId, enemyTeamId2);

                // then
                const enemyTeamIds = strategyFixture.enemyTeams.map(
                    enemyTeam => enemyTeam.id
                );
                expect(enemyTeamIds.includes(enemyTeamId1)).toBeFalsy();
                expect(enemyTeamIds.includes(enemyTeamId2)).toBeFalsy();
            });

            it('전략에 대한 편집 권한이 없으면, 에러를 던진다.', () => {
                // give
                const enemyTeamId = enemyTeam1Fixture.id;

                // when & then
                expect(() =>
                    strategyFixture.removeEnemyTeam(viewerId, enemyTeamId)
                ).toThrow(StrategyEditPermissionDeniedException);

                expect(() =>
                    strategyFixture.removeEnemyTeam(strangerId, enemyTeamId)
                ).toThrow(StrategyEditPermissionDeniedException);
            });

            it('삭제된 전략이라면, 에러를 던진다.', () => {
                // give
                const enemyTeamId = enemyTeam1Fixture.id;
                strategyFixture.delete(ownerId);

                // when & then
                expect(() =>
                    strategyFixture.removeEnemyTeam(ownerId, enemyTeamId)
                ).toThrow(DeletedStrategyException);
            });
        });

        describe('UpdateEnemyTeamLabel', () => {
            const newTeamLabel = TeamLabel.create('B');
            it('전략에 대한 편집 권한이 있으면, 적 팀 라벨이 업데이트된다.', () => {
                // given
                const newTeamLabel1 = TeamLabel.create('Y');
                const newTeamLabel2 = TeamLabel.create('Z');
                const { id: enemyTeamId1, teamLabel: oldEnemyTeamLabel1 } =
                    enemyTeam1Fixture;
                const { id: enemyTeamId2, teamLabel: oldEnemyTeamLabel2 } =
                    enemyTeam2Fixture;

                // when
                strategyFixture.updateEnemyTeamLabel(
                    ownerId,
                    enemyTeamId1,
                    newTeamLabel1
                );
                strategyFixture.updateEnemyTeamLabel(
                    editorId,
                    enemyTeamId2,
                    newTeamLabel2
                );

                // then
                expect(enemyTeam1Fixture.teamLabel).not.toEqual(
                    oldEnemyTeamLabel1
                );
                expect(enemyTeam1Fixture.teamLabel).toEqual(newTeamLabel1);
                expect(enemyTeam2Fixture.teamLabel).not.toEqual(
                    oldEnemyTeamLabel2
                );
                expect(enemyTeam2Fixture.teamLabel).toEqual(newTeamLabel2);
            });

            it('전략에 대한 편집 권한이 없으면, 에러를 던진다.', () => {
                // give
                const enemyTeamId = enemyTeam1Fixture.id;

                // when & then
                expect(() =>
                    strategyFixture.updateEnemyTeamLabel(
                        viewerId,
                        enemyTeamId,
                        newTeamLabel
                    )
                ).toThrow(StrategyEditPermissionDeniedException);

                expect(() =>
                    strategyFixture.updateEnemyTeamLabel(
                        strangerId,
                        enemyTeamId,
                        newTeamLabel
                    )
                ).toThrow(StrategyEditPermissionDeniedException);
            });
            it('삭제된 전략이라면, 에러를 던진다.', () => {
                // give
                const enemyTeamId = enemyTeam1Fixture.id;
                strategyFixture.delete(ownerId);

                // when & then
                expect(() =>
                    strategyFixture.updateEnemyTeamLabel(
                        ownerId,
                        enemyTeamId,
                        newTeamLabel
                    )
                ).toThrow(DeletedStrategyException);
            });
        });
    });

    describe('Circle', () => {
        const phase = 8;
        describe('AddCircle', () => {
            it('전략에 대한 편집 권한이 있으면, Circle이 추가된다.', () => {
                // given
                const strategy = Strategy.create(
                    ownerId,
                    defaultTitle,
                    defaultMap
                );
                strategy.addStrategyShare(
                    ownerId,
                    editorId,
                    editorEmail,
                    StrategySharePermission.EDITABLE
                );
                const phase1 = 1;
                const phase2 = 2;

                // when
                strategy.addCircle(ownerId, phase1);
                strategy.addCircle(editorId, phase2);

                // then
                const circlePhases = strategy.circles.map(
                    circle => circle.phase
                );
                expect(strategy.circles).toHaveLength(2);
                expect(circlePhases.includes(phase1)).toBeTruthy();
                expect(circlePhases.includes(phase2)).toBeTruthy();
            });

            it('Circle이 8개 이상인데 추가하려 하면, 에러를 던진다.', () => {
                // given
                const strategy = Strategy.create(
                    ownerId,
                    defaultTitle,
                    defaultMap
                );

                for (let i = 1; i <= 8; i++) {
                    strategy.addCircle(ownerId, i);
                }

                // when & then
                expect(() => strategy.addCircle(ownerId, 8)).toThrow(
                    CircleLimitExceededException
                );
            });

            it('Phase가 중복되면, 에러를 던진다.', () => {
                // given
                const strategy = Strategy.create(
                    ownerId,
                    defaultTitle,
                    defaultMap
                );
                const phase = 1;
                strategy.addCircle(ownerId, phase);

                // when & then
                expect(() => strategy.addCircle(ownerId, phase)).toThrow(
                    CirclePhaseDuplicateException
                );
            });

            it('전략에 대한 편집 권한이 없으면, 에러를 던진다.', () => {
                // when & then
                expect(() =>
                    strategyFixture.addCircle(viewerId, phase)
                ).toThrow(StrategyEditPermissionDeniedException);

                expect(() =>
                    strategyFixture.addCircle(strangerId, phase)
                ).toThrow(StrategyEditPermissionDeniedException);
            });

            it('삭제된 전략이라면, 에러를 던진다.', () => {
                // give
                strategyFixture.delete(ownerId);

                // when & then
                expect(() => strategyFixture.addCircle(ownerId, phase)).toThrow(
                    DeletedStrategyException
                );
            });
        });

        describe('RemoveCircle', () => {
            it('전략에 대한 편집 권한이 있으면, Circle은 삭제된다.', () => {
                // given
                const circleId1 = circle1Fixture.id;
                const circleId2 = circle2Fixture.id;

                // when
                strategyFixture.removeCircle(ownerId, circleId1);
                strategyFixture.removeCircle(editorId, circleId2);

                // then
                const circleIds = strategyFixture.circles.map(
                    circle => circle.id
                );
                expect(circleIds.includes(circleId1)).toBeFalsy();
                expect(circleIds.includes(circleId2)).toBeFalsy();
            });

            it('전략에 대한 편집 권한이 없으면, 에러를 던진다.', () => {
                // give
                const circleId = circle1Fixture.id;

                // when & then
                expect(() =>
                    strategyFixture.removeCircle(viewerId, circleId)
                ).toThrow(StrategyEditPermissionDeniedException);

                expect(() =>
                    strategyFixture.removeCircle(strangerId, circleId)
                ).toThrow(StrategyEditPermissionDeniedException);
            });
            it('삭제된 전략이라면, 에러를 던진다.', () => {
                // give
                const circleId = circle1Fixture.id;
                strategyFixture.delete(ownerId);

                // when & then
                expect(() =>
                    strategyFixture.removeCircle(ownerId, circleId)
                ).toThrow(DeletedStrategyException);
            });
        });

        describe('UpdateCircleCeneterPosition', () => {
            const newPosition = Position.create(20, 200);

            it('전략에 대한 편집 권한이 있으면, Circle CenterPosition이 업데이트된다.', () => {
                // give
                const newCenterPosition1 = Position.create(10, 10);
                const newCenterPosition2 = Position.create(20, 20);

                const {
                    id: circleId1,
                    centerPosition: oldCircle1centerPosition,
                } = circle1Fixture;
                const {
                    id: circleId2,
                    centerPosition: oldCircle2centerPosition,
                } = circle2Fixture;

                // when
                strategyFixture.updateCircleCeneterPosition(
                    ownerId,
                    circleId1,
                    newCenterPosition1
                );
                strategyFixture.updateCircleCeneterPosition(
                    editorId,
                    circleId2,
                    newCenterPosition2
                );

                // then
                expect(circle1Fixture.centerPosition).not.toEqual(
                    oldCircle1centerPosition
                );
                expect(circle1Fixture.centerPosition).toEqual(
                    newCenterPosition1
                );
                expect(circle2Fixture.centerPosition).not.toEqual(
                    oldCircle2centerPosition
                );
                expect(circle2Fixture.centerPosition).toEqual(
                    newCenterPosition2
                );
            });

            it('전략에 대한 편집 권한이 없으면, 에러를 던진다.', () => {
                // give
                const circleId = circle1Fixture.id;

                // when & then
                expect(() =>
                    strategyFixture.updateCircleCeneterPosition(
                        viewerId,
                        circleId,
                        newPosition
                    )
                ).toThrow(StrategyEditPermissionDeniedException);

                expect(() =>
                    strategyFixture.updateCircleCeneterPosition(
                        strangerId,
                        circleId,
                        newPosition
                    )
                ).toThrow(StrategyEditPermissionDeniedException);
            });

            it('삭제된 전략이라면, 에러를 던진다.', () => {
                // give
                const circleId = circle1Fixture.id;
                strategyFixture.delete(ownerId);

                // when & then
                expect(() =>
                    strategyFixture.updateCircleCeneterPosition(
                        ownerId,
                        circleId,
                        newPosition
                    )
                ).toThrow(DeletedStrategyException);
            });
        });

        describe('UpdateCirclePhase', () => {
            const updatePhase = 2;
            it('전략에 대한 편집 권한이 있으면, Circle Phase가 업데이트된다.', () => {
                // give
                const newPhase1 = 7;
                const newPhase2 = 5;

                const { id: circleId1, phase: oldCircle1Phase } =
                    circle1Fixture;
                const { id: circleId2, phase: oldCircle2Phase } =
                    circle2Fixture;

                // when
                strategyFixture.updateCirclePhase(
                    ownerId,
                    circleId1,
                    newPhase1
                );
                strategyFixture.updateCirclePhase(
                    editorId,
                    circleId2,
                    newPhase2
                );

                // then
                expect(circle1Fixture.phase).not.toEqual(oldCircle1Phase);
                expect(circle1Fixture.phase).toEqual(newPhase1);
                expect(circle2Fixture.phase).not.toEqual(oldCircle2Phase);
                expect(circle2Fixture.phase).toEqual(newPhase2);
            });

            it('이미 있는 Phase로 업데이트 하면, 에러를 던진다.', () => {
                // give
                const newPhase = 7;

                const { id: circleId1 } = circle1Fixture;
                const { id: circleId2 } = circle2Fixture;

                strategyFixture.updateCirclePhase(ownerId, circleId1, newPhase);

                // when & then
                expect(() =>
                    strategyFixture.updateCirclePhase(
                        editorId,
                        circleId2,
                        newPhase
                    )
                ).toThrow(CirclePhaseDuplicateException);
            });

            it('전략에 대한 편집 권한이 없으면, 에러를 던진다.', () => {
                // give
                const circleId = circle1Fixture.id;

                // when & then
                expect(() =>
                    strategyFixture.updateCirclePhase(
                        viewerId,
                        circleId,
                        updatePhase
                    )
                ).toThrow(StrategyEditPermissionDeniedException);

                expect(() =>
                    strategyFixture.updateCirclePhase(
                        strangerId,
                        circleId,
                        updatePhase
                    )
                ).toThrow(StrategyEditPermissionDeniedException);
            });
            it('삭제된 전략이라면, 에러를 던진다.', () => {
                // give
                const circleId = circle1Fixture.id;
                strategyFixture.delete(ownerId);

                // when & then
                expect(() =>
                    strategyFixture.updateCirclePhase(
                        ownerId,
                        circleId,
                        updatePhase
                    )
                ).toThrow(DeletedStrategyException);
            });
        });
    });

    describe('Tag', () => {
        describe('AddTag', () => {
            const content = '태그';
            it('전략에 대한 편집 권한이 있으면, 태그가 추가된다.', () => {
                // given
                const content1 = '첫 번째 태그';
                const content2 = '두 번째 태그';
                const oldTagLength = strategyFixture.tags.length;

                // when
                strategyFixture.addTag(ownerId, content1);
                strategyFixture.addTag(editorId, content2);

                // then
                const tagContents = strategyFixture.tags.map(
                    tag => tag.content
                );

                expect(strategyFixture.tags).toHaveLength(oldTagLength + 2);
                expect(tagContents.includes(content1)).toBeTruthy();
                expect(tagContents.includes(content2)).toBeTruthy();
            });

            it('전략에 대한 편집 권한이 없으면, 에러를 던진다.', () => {
                // when & then
                expect(() => strategyFixture.addTag(viewerId, content)).toThrow(
                    StrategyEditPermissionDeniedException
                );

                expect(() =>
                    strategyFixture.addTag(strangerId, content)
                ).toThrow(StrategyEditPermissionDeniedException);
            });

            it('삭제된 전략이라면, 에러를 던진다.', () => {
                // give
                strategyFixture.delete(ownerId);

                // when & then
                expect(() => strategyFixture.addTag(ownerId, content)).toThrow(
                    DeletedStrategyException
                );
            });
        });

        describe('RemoveTag', () => {
            it('전략에 대한 편집 권한이 있으면, 태그가 삭제된다.', () => {
                // given
                const content = '태그입니다.';

                strategyFixture.addTag(ownerId, content);

                const tagId1 = tagFixture.id;
                const tagId2 = strategyFixture.tags[1].id;

                // when
                strategyFixture.removeTag(ownerId, tagId1);
                strategyFixture.removeTag(editorId, tagId2);

                // then
                const tagIds = strategyFixture.tags.map(tag => tag.id);

                expect(tagIds.includes(tagId1)).toBeFalsy();
                expect(tagIds.includes(tagId2)).toBeFalsy();
            });

            it('전략에 대한 편집 권한이 없으면, 에러를 던진다.', () => {
                // give
                const tagId = tagFixture.id;

                // when & then
                expect(() =>
                    strategyFixture.removeTag(viewerId, tagId)
                ).toThrow(StrategyEditPermissionDeniedException);

                expect(() =>
                    strategyFixture.removeTag(strangerId, tagId)
                ).toThrow(StrategyEditPermissionDeniedException);
            });

            it('삭제된 전략이라면, 에러를 던진다.', () => {
                // give
                const tagId = tagFixture.id;
                strategyFixture.delete(ownerId);

                // when & then
                expect(() => strategyFixture.removeTag(ownerId, tagId)).toThrow(
                    DeletedStrategyException
                );
            });
        });

        describe('UpdateTagPosition', () => {
            const newPosition = Position.create(30, 30);
            it('전략에 대한 편집 권한이 있으면, 태그 위치가 업데이트된다.', () => {
                // given
                const content = '태그입니다.';
                strategyFixture.addTag(ownerId, content);
                const newTagPosition1 = Position.create(300, 300);
                const newTagPosition2 = Position.create(500, 500);

                const { id: tagId1, position: oldTagPosition1 } = tagFixture;
                const { id: tagId2, position: oldTagPosition2 } =
                    strategyFixture.tags[1];

                // when
                strategyFixture.updateTagPosition(
                    ownerId,
                    tagId1,
                    newTagPosition1
                );
                strategyFixture.updateTagPosition(
                    editorId,
                    tagId2,
                    newTagPosition2
                );

                // then
                expect(tagFixture.position).not.toEqual(oldTagPosition1);
                expect(tagFixture.position).toEqual(newTagPosition1);
                expect(strategyFixture.tags[1].position).not.toEqual(
                    oldTagPosition2
                );
                expect(strategyFixture.tags[1].position).toEqual(
                    newTagPosition2
                );
            });

            it('전략에 대한 편집 권한이 없으면, 에러를 던진다.', () => {
                // give
                const tagId = tagFixture.id;

                // when & then
                expect(() =>
                    strategyFixture.updateTagPosition(
                        viewerId,
                        tagId,
                        newPosition
                    )
                ).toThrow(StrategyEditPermissionDeniedException);

                expect(() =>
                    strategyFixture.updateTagPosition(
                        strangerId,
                        tagId,
                        newPosition
                    )
                ).toThrow(StrategyEditPermissionDeniedException);
            });

            it('삭제된 전략이라면, 에러를 던진다.', () => {
                // give
                const tagId = tagFixture.id;
                strategyFixture.delete(ownerId);

                // when & then
                expect(() =>
                    strategyFixture.updateTagPosition(
                        ownerId,
                        tagId,
                        newPosition
                    )
                ).toThrow(DeletedStrategyException);
            });
        });

        describe('UpdateTagContent', () => {
            const newContent = '내용편집';
            it('전략에 대한 편집 권한이 있으면, 태그 위치가 업데이트된다.', () => {
                // given
                const content = '태그입니다.';
                strategyFixture.addTag(ownerId, content);

                const newTagContent1 = '2026';
                const newTagContent2 = '2027';

                const { id: tagId1, content: oldTagContent1 } = tagFixture;
                const { id: tagId2, content: oldTagContent2 } =
                    strategyFixture.tags[1];

                // when
                strategyFixture.updateTagContent(
                    ownerId,
                    tagId1,
                    newTagContent1
                );
                strategyFixture.updateTagContent(
                    editorId,
                    tagId2,
                    newTagContent2
                );

                // then
                expect(tagFixture.content).not.toEqual(oldTagContent1);
                expect(tagFixture.content).toEqual(newTagContent1);
                expect(strategyFixture.tags[1].content).not.toEqual(
                    oldTagContent2
                );
                expect(strategyFixture.tags[1].content).toEqual(newTagContent2);
            });

            it('전략에 대한 편집 권한이 없으면, 에러를 던진다.', () => {
                // give
                const tagId = tagFixture.id;

                // when & then
                expect(() =>
                    strategyFixture.updateTagContent(
                        viewerId,
                        tagId,
                        newContent
                    )
                ).toThrow(StrategyEditPermissionDeniedException);

                expect(() =>
                    strategyFixture.updateTagContent(
                        strangerId,
                        tagId,
                        newContent
                    )
                ).toThrow(StrategyEditPermissionDeniedException);
            });

            it('삭제된 전략이라면, 에러를 던진다.', () => {
                // give
                const tagId = tagFixture.id;
                strategyFixture.delete(ownerId);

                // when & then
                expect(() =>
                    strategyFixture.updateTagContent(ownerId, tagId, newContent)
                ).toThrow(DeletedStrategyException);
            });
        });
    });

    describe('StrategyShare', () => {
        describe('AddStrategyShare', () => {
            const permission = StrategySharePermission.EDITABLE;
            it('전략에 대한 소유주라면, 전략 공유가 된다.', () => {
                // given
                const strategy = Strategy.create(
                    ownerId,
                    defaultTitle,
                    defaultMap
                );

                // when
                strategy.addStrategyShare(
                    ownerId,
                    editorId,
                    editorEmail,
                    StrategySharePermission.EDITABLE
                );

                // then
                expect(strategy.shares[0].sharedUserId).toEqual(editorId);
                expect(strategy.shares[0].sharedEmail).toEqual(editorEmail);
                expect(strategy.shares[0].permission).toEqual(
                    StrategySharePermission.EDITABLE
                );
            });

            it('자기 자신에게 공유하면, 에러를 던진다.', () => {
                // given
                const strategy = Strategy.create(
                    ownerId,
                    defaultTitle,
                    defaultMap
                );

                // when & then
                expect(() =>
                    strategy.addStrategyShare(
                        ownerId,
                        ownerId,
                        ownerEmail,
                        StrategySharePermission.EDITABLE
                    )
                ).toThrow(StrategyShareSelfDeniedException);
            });

            it('이미 공유받은 대상이라면, 에러를 던진다.', () => {
                // given
                const strategy = Strategy.create(
                    ownerId,
                    defaultTitle,
                    defaultMap
                );
                strategy.addStrategyShare(
                    ownerId,
                    editorId,
                    editorEmail,
                    StrategySharePermission.EDITABLE
                );

                // when & then
                expect(() =>
                    strategy.addStrategyShare(
                        ownerId,
                        editorId,
                        editorEmail,
                        StrategySharePermission.EDITABLE
                    )
                ).toThrow(StrategyShareDuplicateException);
            });

            it('전략에 대한 소유주가 아니라면, 에러를 던진다.', () => {
                // when & then
                expect(() =>
                    strategyFixture.addStrategyShare(
                        editorId,
                        strangerId,
                        strangerEmail,
                        permission
                    )
                ).toThrow(StrategyPermissionDeniedException);

                expect(() =>
                    strategyFixture.addStrategyShare(
                        viewerId,
                        strangerId,
                        strangerEmail,
                        permission
                    )
                ).toThrow(StrategyPermissionDeniedException);

                expect(() =>
                    strategyFixture.addStrategyShare(
                        strangerId,
                        strangerId,
                        strangerEmail,
                        permission
                    )
                ).toThrow(StrategyPermissionDeniedException);
            });

            it('삭제된 전략이라면, 에러를 던진다.', () => {
                // give
                strategyFixture.delete(ownerId);

                // when & then
                expect(() =>
                    strategyFixture.addStrategyShare(
                        ownerId,
                        strangerId,
                        strangerEmail,
                        permission
                    )
                ).toThrow(DeletedStrategyException);
            });
        });

        describe('UpdateStrategySharePermission', () => {
            const newPermission = StrategySharePermission.ACCESS_DENIED;
            it('전략에 대한 소유주라면, 권한 업데이트가 된다.', () => {
                // given
                const { id: strategyShareId, permission: oldPermission } =
                    strategyShareEditorFixture;

                // when
                strategyFixture.updateStrategySharePermission(
                    ownerId,
                    strategyShareId,
                    newPermission
                );

                // then
                expect(strategyShareEditorFixture.permission).not.toEqual(
                    oldPermission
                );
                expect(strategyShareEditorFixture.permission).toEqual(
                    newPermission
                );
            });

            it('전략에 대한 소유주가 아니라면, 에러를 던진다.', () => {
                // give
                const shareId = strategyShareEditorFixture.id;

                // when & then
                expect(() =>
                    strategyFixture.updateStrategySharePermission(
                        editorId,
                        shareId,
                        newPermission
                    )
                ).toThrow(StrategyPermissionDeniedException);

                expect(() =>
                    strategyFixture.updateStrategySharePermission(
                        viewerId,
                        shareId,
                        newPermission
                    )
                ).toThrow(StrategyPermissionDeniedException);

                expect(() =>
                    strategyFixture.updateStrategySharePermission(
                        strangerId,
                        shareId,
                        newPermission
                    )
                ).toThrow(StrategyPermissionDeniedException);
            });

            it('삭제된 전략이라면, 에러를 던진다.', () => {
                // give
                const shareId = strategyShareEditorFixture.id;
                strategyFixture.delete(ownerId);

                // when & then
                expect(() =>
                    strategyFixture.updateStrategySharePermission(
                        ownerId,
                        shareId,
                        newPermission
                    )
                ).toThrow(DeletedStrategyException);
            });
        });
    });

    describe('Title', () => {
        describe('UpdateTitle', () => {
            const newTitle = '새로운 제목';
            it('전략에 대한 소유주라면, 업데이트 된다.', () => {
                // given
                const oldTitle = strategyFixture.title;

                // when
                strategyFixture.updateTitle(ownerId, newTitle);

                // then
                expect(strategyFixture.title).not.toEqual(oldTitle);
                expect(strategyFixture.title).toEqual(newTitle);
            });

            it('전략에 대한 소유주가 아니라면, 에러를 던진다.', () => {
                // when & then
                expect(() =>
                    strategyFixture.updateTitle(editorId, newTitle)
                ).toThrow(StrategyPermissionDeniedException);
            });

            it('삭제된 전략이라면, 에러를 던진다.', () => {
                // give
                strategyFixture.delete(ownerId);

                // when & then
                expect(() =>
                    strategyFixture.updateTitle(ownerId, newTitle)
                ).toThrow(DeletedStrategyException);
            });
        });
    });

    describe('Map', () => {
        describe('UpdateMap', () => {
            const newMap = PubgMap.VIKENDI;
            it('전략에 대한 소유주라면, 업데이트 된다.', () => {
                // given
                const oldMap = strategyFixture.map;

                // when
                strategyFixture.updateMap(ownerId, newMap);

                // then
                expect(strategyFixture.map).not.toEqual(oldMap);
                expect(strategyFixture.map).toEqual(newMap);
            });

            it('전략에 대한 소유주가 아니라면, 에러를 던진다.', () => {
                // when & then
                expect(() =>
                    strategyFixture.updateMap(editorId, newMap)
                ).toThrow(StrategyPermissionDeniedException);
            });
            it('삭제된 전략이라면, 에러를 던진다.', () => {
                // give
                strategyFixture.delete(ownerId);

                // when & then
                expect(() =>
                    strategyFixture.updateMap(editorId, newMap)
                ).toThrow(DeletedStrategyException);
            });
        });
    });

    describe('Comment', () => {
        describe('AddComment', () => {
            const position = Position.create(10, 10);

            it('누구나 댓글을 작성할 수 있다.', () => {
                // given
                const commentContent1 = CommentContent.create('소유주');
                const commentContent2 = CommentContent.create('에디터');
                const commentContent3 = CommentContent.create('뷰어');
                const commentContent4 = CommentContent.create('익명');
                const oldCommentLength = strategyFixture.comments.length;

                // when
                strategyFixture.addComment(
                    ownerId,
                    ownerEmail,
                    commentContent1,
                    position,
                    null
                );
                strategyFixture.addComment(
                    editorId,
                    editorEmail,
                    commentContent2,
                    position,
                    null
                );
                strategyFixture.addComment(
                    viewerId,
                    viewerEmail,
                    commentContent3,
                    position,
                    null
                );
                strategyFixture.addComment(
                    strangerId,
                    strangerEmail,
                    commentContent4,
                    position,
                    null
                );

                // then
                const commentContents = strategyFixture.comments.map(
                    comment => comment.content
                );
                expect(strategyFixture.comments).toHaveLength(
                    oldCommentLength + 4
                );
                expect(commentContents.includes(commentContent1)).toBeTruthy();
                expect(commentContents.includes(commentContent2)).toBeTruthy();
                expect(commentContents.includes(commentContent3)).toBeTruthy();
                expect(commentContents.includes(commentContent4)).toBeTruthy();
            });

            it('자식 댓글은 부모 댓글에 작성할 수 있다.', () => {
                // given
                const commentContent = CommentContent.create('자식댓글');

                // when
                strategyFixture.addComment(
                    ownerId,
                    ownerEmail,
                    commentContent,
                    position,
                    parentCommentFixutre.id
                );

                // then
                const writtenComment = strategyFixture.comments.find(
                    comment =>
                        comment.content.equals(commentContent) &&
                        comment.parentCommentId?.equals(parentCommentFixutre.id)
                );

                expect(writtenComment).not.toBeNull();
                expect(writtenComment?.content).toBe(commentContent);
                expect(writtenComment?.parentCommentId).toBe(
                    parentCommentFixutre.id
                );
            });

            it('자식 댓글을 작성하는데, 부모 댓글을 찾을 수 없다면 에러를 던진다.', () => {
                // given
                const commentContent = CommentContent.create('자식댓글');

                // when & then
                expect(() =>
                    strategyFixture.addComment(
                        ownerId,
                        ownerEmail,
                        commentContent,
                        position,
                        CommentId.generate()
                    )
                ).toThrow(CommentNotFoundException);
            });

            it('자식 댓글을 작성하는데, 부모 댓글이 아니라면 에러를 던진다.', () => {
                // given
                const commentContent = CommentContent.create('자식댓글');

                // when & then
                expect(() =>
                    strategyFixture.addComment(
                        ownerId,
                        ownerEmail,
                        commentContent,
                        position,
                        childCommentFixutre1.id
                    )
                ).toThrow(ChildCommentException);
            });

            it('삭제된 전략이라면, 에러를 던진다.', () => {
                // given
                const content = CommentContent.create('내용');
                strategyFixture.delete(ownerId);

                // when & then
                expect(() =>
                    strategyFixture.addComment(
                        ownerId,
                        editorEmail,
                        content,
                        position,
                        null
                    )
                ).toThrow(DeletedStrategyException);
            });
        });

        describe('RemoveComment', () => {
            it('댓글 작성자라면, 삭제된다.', () => {
                // given
                const position = Position.create(10, 10);

                const commentContent = CommentContent.create('자식댓글');
                strategyFixture.addComment(
                    ownerId,
                    ownerEmail,
                    commentContent,
                    position,
                    parentCommentFixutre.id
                );

                const writtenCommentId = strategyFixture.comments.find(
                    comment =>
                        comment.content.equals(commentContent) &&
                        comment.parentCommentId?.equals(parentCommentFixutre.id)
                )!.id;

                // when
                strategyFixture.removeComment(ownerId, writtenCommentId);

                // then
                const commentIds = strategyFixture.comments.map(
                    comment => comment.id
                );

                expect(commentIds.includes(writtenCommentId)).toBeFalsy();
            });

            it('댓글 작성자가 아니라면, 에러를 던진다.', () => {
                // give
                const commentId = parentCommentFixutre.id;

                // when & then
                expect(() =>
                    strategyFixture.removeComment(editorId, commentId)
                ).toThrow(InvalidAuthorException);

                expect(() =>
                    strategyFixture.removeComment(viewerId, commentId)
                ).toThrow(InvalidAuthorException);

                expect(() =>
                    strategyFixture.removeComment(strangerId, commentId)
                ).toThrow(InvalidAuthorException);
            });

            it('삭제된 전략이라면, 에러를 던진다.', () => {
                // give
                const commentId = parentCommentFixutre.id;
                strategyFixture.delete(ownerId);

                // when & then
                expect(() =>
                    strategyFixture.removeComment(ownerId, commentId)
                ).toThrow(DeletedStrategyException);
            });
        });

        describe('UpdateCommentContent', () => {
            const newContent = CommentContent.create('새로운 내용');

            it('댓글 작성자라면, 내용이 업데이트된다.', () => {
                // given
                const { id: commentId, content: oldCommentContent } =
                    parentCommentFixutre;

                // when
                strategyFixture.updateCommentContent(
                    ownerId,
                    commentId,
                    newContent
                );

                // then
                expect(parentCommentFixutre.content).not.toEqual(
                    oldCommentContent
                );
                expect(parentCommentFixutre.content).toEqual(newContent);
            });

            it('댓글 작성자가 아니라면, 에러를 던진다.', () => {
                // give
                const commentId = parentCommentFixutre.id;

                // when & then
                expect(() =>
                    strategyFixture.updateCommentContent(
                        editorId,
                        commentId,
                        newContent
                    )
                ).toThrow(InvalidAuthorException);

                expect(() =>
                    strategyFixture.updateCommentContent(
                        viewerId,
                        commentId,
                        newContent
                    )
                ).toThrow(InvalidAuthorException);

                expect(() =>
                    strategyFixture.updateCommentContent(
                        strangerId,
                        commentId,
                        newContent
                    )
                ).toThrow(InvalidAuthorException);
            });

            it('삭제된 전략이라면, 에러를 던진다.', () => {
                // give
                const commentId = parentCommentFixutre.id;
                strategyFixture.delete(ownerId);

                // when & then
                expect(() =>
                    strategyFixture.updateCommentContent(
                        editorId,
                        commentId,
                        newContent
                    )
                ).toThrow(DeletedStrategyException);
            });
        });

        describe('UpdateCommentPosition', () => {
            const newPosition = Position.create(300, 300);
            it('댓글 작성자가 아니라면, 에러를 던진다.', () => {
                // give
                const commentId = parentCommentFixutre.id;

                // when & then
                expect(() =>
                    strategyFixture.updateCommentPosition(
                        editorId,
                        commentId,
                        newPosition
                    )
                ).toThrow(InvalidAuthorException);
            });
            it('삭제된 전략이라면, 에러를 던진다.', () => {
                // give
                const commentId = parentCommentFixutre.id;
                strategyFixture.delete(ownerId);

                // when & then
                expect(() =>
                    strategyFixture.updateCommentPosition(
                        ownerId,
                        commentId,
                        newPosition
                    )
                ).toThrow(DeletedStrategyException);
            });
        });
    });
});
