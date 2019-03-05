export type SeverityOptionValues = 0 | 1 | 2;

// tslint:disable-next-line:interface-name
export interface Casualty {
    age?: number;
    class?: string;
    severity?: SeverityOptionValues;
    mode?: string;
    ageBand?: string;
    $type: string | undefined;
}
