import { PubgMap } from '@domain/strategy/enums/map.enum';
import { TeamPlayer } from '@domain/strategy/models/team-player.model';
import { EnemyTeam } from '@domain/strategy/models/enemy-team.model';
import { Circle } from '@domain/strategy/models/circle.model';
import { Comment } from '@domain/strategy/models/comment.model';
import { StrategyShare } from '@domain/strategy/models/strategy-share.model';
import { AirplanePath } from '@domain/strategy/models/airplane-path.model';
import { Tag } from '@domain/strategy/models/tag.model';

export interface Strategy {
    readonly id: string;
    readonly ownerId: string;
    readonly ownerEmail: string;
    readonly title: string;
    readonly map: PubgMap;
    readonly teamPlayers: TeamPlayer[];
    readonly enemyTeams: EnemyTeam[];
    readonly circles: Circle[];
    readonly airplanePath: AirplanePath | null;
    readonly tags: Tag[];
    readonly shares: StrategyShare[];
    readonly comments: Comment[];
    readonly createdAt: Date;
    readonly updatedAt: Date;
}
