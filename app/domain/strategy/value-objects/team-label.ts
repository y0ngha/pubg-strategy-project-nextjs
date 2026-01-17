import { InvalidTeamLabelException } from '@domain/strategy/exceptions/strategy.exceptions';

export class TeamLabel {
    private constructor(private readonly label: string) {}

    static create(label: string) {
        const trimmed = label.trim();

        TeamLabel.ensureValidTeamLabel(trimmed);

        return new TeamLabel(trimmed);
    }

    static reconstruct(content: string) {
        return new TeamLabel(content);
    }

    private static ensureValidTeamLabel(label: string) {
        if (!TeamLabel.checkOnlyEnglish(label)) {
            throw new InvalidTeamLabelException(label);
        }
    }

    private static checkOnlyEnglish(label: string): boolean {
        const labelRegex = /^([a-zA-Z])$/;

        return labelRegex.test(label);
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
