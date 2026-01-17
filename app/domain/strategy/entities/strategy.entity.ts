import { StrategyId } from '@domain/strategy/value-objects/strategy-id';
import { UserId } from '@domain/shared/value-objects/user-id';
import { TeamPlayer } from '@domain/strategy/entities/team-player.entity';
import { EnemyTeam } from '@domain/strategy/entities/enemy-team.entity';
import { Circle } from '@domain/strategy/entities/circle.entity';
import { AirplanePath } from '@domain/strategy/entities/airplane-path.entity';
import { Tag } from '@domain/strategy/entities/tag.entity';
import { StrategyShare } from '@domain/strategy/entities/strategy-share.entity';
import { Comment } from '@domain/strategy/entities/comment.entity';
import { PubgMap, PubgMapSizes } from '@domain/strategy/enums/map.enum';
import {
    ChildCommentException,
    CircleLimitExceededException,
    CircleNotFoundException,
    CirclePhaseDuplicateException,
    CommentNotFoundException,
    DeletedStrategyException,
    EnemyTeamNotFoundException,
    StrategyEditPermissionDeniedException,
    StrategyPermissionDeniedException,
    StrategyShareDuplicateException,
    StrategyShareNotFoundException,
    StrategyShareSelfDeniedException,
    TagNotFoundException,
    TeamPlayerBelowMinimumException,
    TeamPlayerLimitExceededException,
    TeamPlayerNotFoundException,
} from '@domain/strategy/exceptions/strategy.exceptions';
import { TeamPlayerId } from '@domain/strategy/value-objects/team-player-id';
import { Position } from '@domain/strategy/value-objects/position';
import { TeamLabel } from '@domain/strategy/value-objects/team-label';
import { EnemyTeamId } from '@domain/strategy/value-objects/enemy-team-id';
import { CircleId } from '@domain/strategy/value-objects/circle-id';
import { TagId } from '@domain/strategy/value-objects/tag-id';
import { Marker } from '@domain/strategy/entities/marker.entity';
import { Waypoint } from '@domain/strategy/entities/waypoint.entity';
import { StrategySharePermission } from '@domain/strategy/enums/strategy-share-permission.enum';
import { StrategyShareId } from '@domain/strategy/value-objects/strategy-share-id';
import { Email } from '@domain/shared/value-objects/email';
import { CommentContent } from '@domain/strategy/value-objects/comment-content';
import { CommentId } from '@domain/strategy/value-objects/comment-id';
import { TagContent } from '@domain/strategy/value-objects/tag-content';
import { StrategyTitle } from '@domain/strategy/value-objects/strategy-title';

interface FindEntity<T> {
    value: T;
    index: number;
}

export class Strategy {
    private static readonly DEFAULT_TEAM_PLAYER_POSITION = Position.create(
        10,
        10
    );
    private static readonly DEFAULT_TEAM_PLAYER_PRIORITY = 1;

    private static readonly MAX_CIRCLE_COUNT = 8;

    private static readonly MAX_TEAM_PLAYER_COUNT = 4;
    private static readonly MIN_TEAM_PLAYER_COUNT = 1;

    private constructor(
        public readonly id: StrategyId,
        public readonly ownerId: UserId,
        private _title: StrategyTitle,
        private _map: PubgMap,
        private _teamPlayers: TeamPlayer[],
        private _enemyTeams: EnemyTeam[],
        private _circles: Circle[],
        private _airplanePath: AirplanePath | null,
        private _tags: Tag[],
        private _shares: StrategyShare[],
        private _comments: Comment[],
        private _isEditing: boolean,
        private _isDeleted: boolean,
        public readonly createdAt: Date,
        private _updatedAt: Date
    ) {}

    /**
     * Getters
     */
    get title(): StrategyTitle {
        return this._title;
    }

    get map(): PubgMap {
        return this._map;
    }

    get teamPlayers(): TeamPlayer[] {
        return [...this._teamPlayers];
    }

    get enemyTeams(): EnemyTeam[] {
        return [...this._enemyTeams];
    }

    get circles(): Circle[] {
        return [...this._circles];
    }

    get airplanePath(): AirplanePath | null {
        return this._airplanePath;
    }

    get tags(): Tag[] {
        return [...this._tags];
    }

    get shares(): StrategyShare[] {
        return [...this._shares];
    }

    get comments(): Comment[] {
        return [...this._comments];
    }

    get isEditing(): boolean {
        return this._isEditing;
    }

    get isDeleted(): boolean {
        return this._isDeleted;
    }

    get updatedAt(): Date {
        return this._updatedAt;
    }

    /**
     * Factory Methods
     */
    static create(ownerId: UserId, title: StrategyTitle, map: PubgMap) {
        return new Strategy(
            StrategyId.generate(),
            ownerId,
            title,
            map,
            [
                TeamPlayer.create(
                    Strategy.DEFAULT_TEAM_PLAYER_PRIORITY,
                    Strategy.DEFAULT_TEAM_PLAYER_POSITION,
                    null,
                    null
                ),
            ],
            [],
            [],
            null,
            [],
            [],
            [],
            false,
            false,
            new Date(),
            new Date()
        );
    }

    static reconstruct(
        id: StrategyId,
        ownerId: UserId,
        title: StrategyTitle,
        map: PubgMap,
        teamPlayers: TeamPlayer[],
        enemyTeams: EnemyTeam[],
        circles: Circle[],
        airplanePath: AirplanePath | null,
        tags: Tag[],
        shares: StrategyShare[],
        comments: Comment[],
        isEditing: boolean,
        createdAt: Date,
        updatedAt: Date
    ) {
        return new Strategy(
            id,
            ownerId,
            title,
            map,
            [...teamPlayers],
            [...enemyTeams],
            [...circles],
            airplanePath,
            [...tags],
            [...shares],
            [...comments],
            isEditing,
            false,
            createdAt,
            updatedAt
        );
    }

    delete(actorId: UserId) {
        this.ensureNotDeleted();
        this.ensureOwner(actorId);

        this.cascadeDelete();

        this._isDeleted = true;
    }

    isAccessibleByUserId(userId: UserId): boolean {
        this.ensureNotDeleted();

        if (this.ownerId.equals(userId)) {
            return true;
        }

        return this.shares.some(
            share =>
                share.sharedUserId.equals(userId) &&
                (share.isEditable || share.isReadonly)
        );
    }

    /**
     * Team Players
     */
    addTeamPlayer(actorId: UserId) {
        this.ensureNotDeleted();
        this.ensureEditPermission(actorId);
        this.ensureCanAddTeamPlayer();

        const teamPlayer = TeamPlayer.create(
            this.getNextPriorityTeamPlayer(),
            this.getMapCenterPosition(),
            null,
            null
        );

        this._teamPlayers.push(teamPlayer);
        this._updatedAt = new Date();
    }

    removeTeamPlayer(actorId: UserId, teamPlayerId: TeamPlayerId) {
        this.ensureNotDeleted();
        this.ensureEditPermission(actorId);
        this.ensureNotLastPlayer();

        const { value: teamPlayer, index } = this.findTeamPlayer(teamPlayerId);

        teamPlayer.delete();

        this._teamPlayers.splice(index, 1);
        this._updatedAt = new Date();
    }

    updateTeamPlayerPosition(
        actorId: UserId,
        teamPlayerId: TeamPlayerId,
        position: Position
    ) {
        this.ensureNotDeleted();
        this.ensureEditPermission(actorId);

        const { value: teamPlayer } = this.findTeamPlayer(teamPlayerId);

        teamPlayer.updatePosition(position);
        this._updatedAt = new Date();
    }

    addTeamPlayerMarker(
        actorId: UserId,
        teamPlayerId: TeamPlayerId,
        position: Position
    ) {
        this.ensureNotDeleted();
        this.ensureEditPermission(actorId);

        const { value: teamPlayer } = this.findTeamPlayer(teamPlayerId);

        const marker = Marker.create(position);

        teamPlayer.assignMarker(marker);
        this._updatedAt = new Date();
    }

    removeTeamPlayerMarker(actorId: UserId, teamPlayerId: TeamPlayerId) {
        this.ensureNotDeleted();
        this.ensureEditPermission(actorId);

        const { value: teamPlayer } = this.findTeamPlayer(teamPlayerId);

        teamPlayer.clearMarker();
        this._updatedAt = new Date();
    }

    addTeamPlayerWaypoint(
        actorId: UserId,
        teamPlayerId: TeamPlayerId,
        positions: Position[]
    ) {
        this.ensureNotDeleted();
        this.ensureEditPermission(actorId);

        const { value: teamPlayer } = this.findTeamPlayer(teamPlayerId);

        const waypoint = Waypoint.create(positions);

        teamPlayer.assignWaypoint(waypoint);
        this._updatedAt = new Date();
    }

    removeTeamPlayerWaypoint(actorId: UserId, teamPlayerId: TeamPlayerId) {
        this.ensureNotDeleted();
        this.ensureEditPermission(actorId);

        const { value: teamPlayer } = this.findTeamPlayer(teamPlayerId);

        teamPlayer.clearWaypoint();
        this._updatedAt = new Date();
    }

    /**
     * Enemy Teams
     */
    addEnemyTeam(actorId: UserId, teamLabel: TeamLabel) {
        this.ensureNotDeleted();
        this.ensureEditPermission(actorId);

        const enemyTeam = EnemyTeam.create(
            teamLabel,
            this.getMapCenterPosition()
        );

        this._enemyTeams.push(enemyTeam);
        this._updatedAt = new Date();
    }

    removeEnemyTeam(actorId: UserId, enemyTeamId: EnemyTeamId) {
        this.ensureNotDeleted();
        this.ensureEditPermission(actorId);

        const { value: enemyTeam, index } = this.findEnemyTeam(enemyTeamId);

        enemyTeam.delete();

        this._enemyTeams.splice(index, 1);
        this._updatedAt = new Date();
    }

    updateEnemyTeam(
        actorId: UserId,
        enemyTeamId: EnemyTeamId,
        teamLabel?: TeamLabel,
        position?: Position
    ) {
        this.ensureNotDeleted();
        this.ensureEditPermission(actorId);

        const { value: enemyTeam } = this.findEnemyTeam(enemyTeamId);

        if (teamLabel) {
            enemyTeam.updateTeamLabel(teamLabel);
        }

        if (position) {
            enemyTeam.updatePosition(position);
        }

        this._updatedAt = new Date();
    }

    /**
     * Circles
     */
    addCircle(actorId: UserId, phase: number) {
        this.ensureNotDeleted();
        this.ensureEditPermission(actorId);
        this.ensureCanAddCircle();
        this.ensureNoDuplicatePhase(phase);

        const circle = Circle.create(this.getMapCenterPosition(), phase);

        this._circles.push(circle);
        this._updatedAt = new Date();
    }

    removeCircle(actorId: UserId, circleId: CircleId) {
        this.ensureNotDeleted();
        this.ensureEditPermission(actorId);

        const { value: circle, index } = this.findCircle(circleId);

        circle.delete();

        this._circles.splice(index, 1);
        this._updatedAt = new Date();
    }

    updateCircle(
        actorId: UserId,
        circleId: CircleId,
        position?: Position,
        phase?: number
    ) {
        this.ensureNotDeleted();
        this.ensureEditPermission(actorId);

        const { value: circle } = this.findCircle(circleId);

        if (position) {
            circle.updateCenterPosition(position);
        }

        if (phase != null) {
            this.ensureNoDuplicatePhase(phase);

            circle.updatePhase(phase);
        }

        this._updatedAt = new Date();
    }

    /**
     * Airplane
     */
    updateAirplanePath(
        actorId: UserId,
        startPosition: Position,
        endPosition: Position
    ) {
        this.ensureNotDeleted();
        this.ensureEditPermission(actorId);

        if (
            this._airplanePath?.startPosition.equals(startPosition) &&
            this._airplanePath?.endPosition.equals(endPosition)
        )
            return;

        this._airplanePath;

        this._airplanePath = AirplanePath.create(startPosition, endPosition);
        this._updatedAt = new Date();
    }

    removeAirplanePath(actorId: UserId) {
        this.ensureNotDeleted();
        this.ensureEditPermission(actorId);

        this._airplanePath = null;
        this._updatedAt = new Date();
    }

    /**
     * Tags
     */
    addTag(actorId: UserId, content: TagContent) {
        this.ensureNotDeleted();
        this.ensureEditPermission(actorId);

        const tag = Tag.create(this.getMapCenterPosition(), content);

        this._tags.push(tag);
        this._updatedAt = new Date();
    }

    removeTag(actorId: UserId, tagId: TagId) {
        this.ensureNotDeleted();
        this.ensureEditPermission(actorId);

        const { value: tag, index } = this.findTag(tagId);

        tag.delete();

        this._tags.splice(index, 1);
        this._updatedAt = new Date();
    }

    /**
     * TODO 리팩토링 필요: 2026.01.17
     * 기존에 메서드 분리되어있던 것을 합쳤는데, 이는 잘못 합친 것 같음.
     * 수정의 이유가 다르면 메서드도 달라야 하는데, 합쳐버렸음.
     * 기존에 메서드 분리되어있던 것을 합친 이유는 find...를 이용하여 엔티티를 찾아오는 연산 비용을 아끼고자였는데,
     * 이미 API에서 불러와 메모리에 올라와있는 시점이고, 그것을 순회한다고 하여 큰 오버헤드가 발생하지 않음.
     * 더군다나 배열 순회도 그리 많이하는 편도 아닐 것으로 생각되어, 메서드는 분리하는게 트레이드오프가 더 좋을 것 같음.
     */
    updateTag(
        actorId: UserId,
        tagId: TagId,
        content?: TagContent,
        position?: Position
    ) {
        this.ensureNotDeleted();
        this.ensureEditPermission(actorId);

        const { value: tag } = this.findTag(tagId);

        let isChanged = false;

        if (content) {
            if (tag.updateContent(content)) {
                isChanged = true;
            }
        }

        if (position) {
            if (tag.updatePosition(position)) {
                isChanged = true;
            }
        }

        if (isChanged) {
            this._updatedAt = new Date();
        }
    }

    /**
     * Shares
     */
    addStrategyShare(
        actorId: UserId,
        targetUserId: UserId,
        targetUserEmail: Email,
        permission: StrategySharePermission
    ) {
        this.ensureNotDeleted();
        this.ensureNotSelf(targetUserId);
        this.ensureNoDuplicateShareUser(targetUserId);
        this.ensureOwner(actorId);

        const strategyShare = StrategyShare.create(
            targetUserId,
            targetUserEmail,
            permission
        );

        this._shares.push(strategyShare);
        this._updatedAt = new Date();
    }

    updateStrategySharePermission(
        actorId: UserId,
        strategyShareId: StrategyShareId,
        permission: StrategySharePermission
    ) {
        this.ensureNotDeleted();
        this.ensureOwner(actorId);

        const { value: strategyShare } =
            this.findStrategyShare(strategyShareId);

        const isChanged = strategyShare.updatePermission(permission);

        if (isChanged) {
            this._updatedAt = new Date();
        }
    }

    /**
     * Strategy
     */

    /**
     * TODO 리팩토링 필요: 2026.01.17
     * 기존에 메서드 분리되어있던 것을 합쳤는데, 이는 잘못 합친 것 같음.
     * 수정의 이유가 다르면 메서드도 달라야 하는데, 합쳐버렸음.
     * 기존에 메서드 분리되어있던 것을 합친 이유는 find...를 이용하여 엔티티를 찾아오는 연산 비용을 아끼고자였는데,
     * 이미 API에서 불러와 메모리에 올라와있는 시점이고, 그것을 순회한다고 하여 큰 오버헤드가 발생하지 않음.
     * 더군다나 배열 순회도 그리 많이하는 편도 아닐 것으로 생각되어, 메서드는 분리하는게 트레이드오프가 더 좋을 것 같음.
     */
    update(actorId: UserId, title?: StrategyTitle, map?: PubgMap) {
        this.ensureNotDeleted();
        this.ensureOwner(actorId);

        const isTitleChanged =
            title !== undefined && !this._title.equals(title);
        const isMapChange = map !== undefined && !(this._map === map);

        if (isTitleChanged) {
            this._title = title;
        }

        if (isMapChange) {
            this._map = map;
        }

        if (isTitleChanged || isMapChange) {
            this._updatedAt = new Date();
        }
    }

    /**
     * Comments
     */
    addComment(
        actorId: UserId,
        actorEmail: Email,
        content: CommentContent,
        position: Position | null,
        parentCommentId: CommentId | null
    ) {
        this.ensureNotDeleted();

        if (parentCommentId !== null) {
            this.ensureParentComment(parentCommentId);
        }

        const comment = Comment.create(
            position,
            actorId,
            actorEmail,
            content,
            parentCommentId
        );

        this._comments.push(comment);
    }

    removeComment(actorId: UserId, commentId: CommentId) {
        this.ensureNotDeleted();

        const { value: comment, index } = this.findComment(commentId);

        comment.delete(actorId);

        this._comments.splice(index, 1);
    }

    /**
     * TODO 리팩토링 필요: 2026.01.17
     * 기존에 메서드 분리되어있던 것을 합쳤는데, 이는 잘못 합친 것 같음.
     * 수정의 이유가 다르면 메서드도 달라야 하는데, 합쳐버렸음.
     * 기존에 메서드 분리되어있던 것을 합친 이유는 find...를 이용하여 엔티티를 찾아오는 연산 비용을 아끼고자였는데,
     * 이미 API에서 불러와 메모리에 올라와있는 시점이고, 그것을 순회한다고 하여 큰 오버헤드가 발생하지 않음.
     * 더군다나 배열 순회도 그리 많이하는 편도 아닐 것으로 생각되어, 메서드는 분리하는게 트레이드오프가 더 좋을 것 같음.
     */
    updateComment(
        actorId: UserId,
        commentId: CommentId,
        content?: CommentContent,
        position?: Position
    ) {
        this.ensureNotDeleted();

        const { value: comment } = this.findComment(commentId);

        if (content) {
            comment.updateContent(actorId, content);
        }

        if (position) {
            comment.updatePosition(actorId, position);
        }
    }

    /**
     * Helpers
     */
    private cascadeDelete() {
        this._teamPlayers.forEach(teamPlayer => teamPlayer.delete());
        this._enemyTeams.forEach(enemyTeam => enemyTeam.delete());
        this._circles.forEach(circle => circle.delete());
        this._airplanePath?.delete();
        this._tags.forEach(tag => tag.delete());
        this._shares.forEach(share => share.delete());
    }

    private getMapCenterPosition(): Position {
        const size = PubgMapSizes[this._map];

        return Position.create(size.width / 2, size.height / 2);
    }

    private getNextPriorityTeamPlayer(): number {
        const usedPriorities = new Set(
            this._teamPlayers.map(teamPlayer => teamPlayer.priority)
        );

        for (let i = 1; i <= Strategy.MAX_TEAM_PLAYER_COUNT; i++) {
            if (!usedPriorities.has(i)) {
                return i;
            }
        }

        return Strategy.MIN_TEAM_PLAYER_COUNT;
    }

    /**
     * Find Entity
     */
    private findTeamPlayer(teamPlayerId: TeamPlayerId): FindEntity<TeamPlayer> {
        const index = this._teamPlayers.findIndex(teamPlayer =>
            teamPlayer.id.equals(teamPlayerId)
        );

        if (index === -1) throw new TeamPlayerNotFoundException();

        return { value: this._teamPlayers[index], index };
    }

    private findEnemyTeam(enemyTeamId: EnemyTeamId): FindEntity<EnemyTeam> {
        const index = this._enemyTeams.findIndex(enemyTeam =>
            enemyTeam.id.equals(enemyTeamId)
        );

        if (index === -1) throw new EnemyTeamNotFoundException();

        return { value: this._enemyTeams[index], index };
    }

    private findCircle(circleId: CircleId): FindEntity<Circle> {
        const index = this._circles.findIndex(circle =>
            circle.id.equals(circleId)
        );

        if (index === -1) throw new CircleNotFoundException();

        return { value: this._circles[index], index };
    }

    private findTag(tagId: TagId): FindEntity<Tag> {
        const index = this._tags.findIndex(tag => tag.id.equals(tagId));

        if (index === -1) throw new TagNotFoundException();

        return { value: this._tags[index], index };
    }

    private findStrategyShare(
        strategyShareId: StrategyShareId
    ): FindEntity<StrategyShare> {
        const index = this._shares.findIndex(share =>
            share.id.equals(strategyShareId)
        );

        if (index === -1) throw new StrategyShareNotFoundException();

        return { value: this._shares[index], index };
    }

    private findComment(commentId: CommentId): FindEntity<Comment> {
        const index = this._comments.findIndex(comment =>
            comment.id.equals(commentId)
        );

        if (index === -1) throw new CommentNotFoundException();

        return { value: this._comments[index], index };
    }

    /**
     * Ensures
     */
    private ensureCanAddTeamPlayer(): void {
        if (this._teamPlayers.length >= Strategy.MAX_TEAM_PLAYER_COUNT) {
            throw new TeamPlayerLimitExceededException();
        }
    }

    private ensureCanAddCircle(): void {
        if (this._circles.length >= Strategy.MAX_CIRCLE_COUNT) {
            throw new CircleLimitExceededException();
        }
    }

    private ensureNotLastPlayer(): void {
        if (this._teamPlayers.length <= Strategy.MIN_TEAM_PLAYER_COUNT) {
            throw new TeamPlayerBelowMinimumException();
        }
    }

    private ensureNoDuplicatePhase(phase: number) {
        const isDuplicate = this._circles.some(
            circle => circle.phase === phase
        );

        if (isDuplicate) {
            throw new CirclePhaseDuplicateException();
        }
    }

    private ensureEditPermission(actorId: UserId) {
        if (this.ownerId.equals(actorId)) {
            return;
        }

        const hasSharedEditPermission = this._shares.some(
            share => share.sharedUserId.equals(actorId) && share.isEditable
        );

        if (!hasSharedEditPermission) {
            throw new StrategyEditPermissionDeniedException();
        }
    }

    private ensureOwner(actorId: UserId) {
        if (!this.ownerId.equals(actorId)) {
            throw new StrategyPermissionDeniedException();
        }
    }

    private ensureNoDuplicateShareUser(userId: UserId) {
        const isDuplicate = this._shares.some(share =>
            share.sharedUserId.equals(userId)
        );

        if (isDuplicate) {
            throw new StrategyShareDuplicateException();
        }
    }

    private ensureNotDeleted() {
        if (this._isDeleted) {
            throw new DeletedStrategyException();
        }
    }

    private ensureNotSelf(actorId: UserId) {
        if (this.ownerId.equals(actorId)) {
            throw new StrategyShareSelfDeniedException();
        }
    }

    private ensureParentComment(parentCommentId: CommentId) {
        const comment = this._comments.find(comment =>
            comment.id.equals(parentCommentId)
        );

        if (!comment) {
            throw new CommentNotFoundException();
        }

        if (!comment.isParent) {
            throw new ChildCommentException();
        }
    }
}
