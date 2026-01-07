import { InvalidTeamLabelException } from '@domain/strategy/exceptions/strategy.exceptions';

export class TeamLabel {
    private constructor(private readonly label: string) {
        this.validateTeamLabel(label);
    }

    static create(label: string) {
        return new TeamLabel(label.trim());
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
