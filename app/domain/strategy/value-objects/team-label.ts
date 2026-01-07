import { InvalidTeamLabelException } from '@domain/strategy/exceptions/strategy.exceptions';

export class TeamLabel {
    private readonly label: string;

    private constructor(label: string) {
        const trimLabel = label.trim();

        this.validateTeamLabel(trimLabel);

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

    private validateTeamLabel(label: string) {
        if (!this.checkOnlyEnglish(label)) {
            throw new InvalidTeamLabelException(label);
        }
    }

    private checkOnlyEnglish(label: string): boolean {
        const labelRegex = /^([a-zA-Z])$/;

        return labelRegex.test(label);
    }
}
