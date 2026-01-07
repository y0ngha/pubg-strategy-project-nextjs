import { InvalidTeamLabelException } from '@domain/strategy/exceptions/strategy.exceptions';

export class TeamLabel {
    private readonly label: string;

    private constructor(label: string) {
        const trimLabel = label.trim();
        const labelRegex = /^([a-zA-Z])$/;

        if (!labelRegex.test(trimLabel)) {
            throw new InvalidTeamLabelException(label);
        }

        this.label = trimLabel;
    }

    static create(label: string) {
        return new TeamLabel(label);
    }

    equals(teamLabel: TeamLabel) {
        if (!(teamLabel instanceof TeamLabel)) {
            return false;
        }

        return this.label === teamLabel.label;
    }

    toString() {
        return this.label;
    }

    toJSON() {
        return this.label;
    }
}
