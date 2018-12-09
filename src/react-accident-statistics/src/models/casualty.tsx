export type SeverityOptionValues = 0 | 1 | 2;

export interface Casualty {
    age?: number;
    class?: string;
    severity?: SeverityOptionValues;
    mode?: string;
    ageBand?: string;
}
