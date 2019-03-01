import { SeverityOptionValues } from './accident-statistic';

export interface Casualty {
    age?: number;
    class?: string;
    severity?: SeverityOptionValues;
    mode?: string;
    ageBand?: string;
}
