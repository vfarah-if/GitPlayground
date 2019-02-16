export type SortByOptions = "DateAscending" | "LocationAscending" | "DateDescending" |
    "LocationDescending" | "BoroughAscending" | "AccidentStatisticIdAscending" |
    "TflIdAscending" | "BoroughDescending" | "AccidentStatisticIdDescending" | "TflIdDescending";
export type SeverityOptions = "Serious" | "Slight" | "Fatal";

export class AccidentsQuery {
    public from: Date|string;
    public get orderBy(): SortByOptions {
        return this.sortBy as SortByOptions;
    }

    public set orderBy(sortBy: SortByOptions) {
        this.sortBy = sortBy;
    }

    public page: number|string;
    public pageSize: number|string;
    public sortBy: SortByOptions;
    public severity: SeverityOptions;
    public to: Date|string;
    constructor() {
        this.severity = "Fatal";
        this.sortBy = "DateDescending";
        this.page = 1;
        this.pageSize = 100;
        this.from = new Date(`${process.env.MAX_YEAR}-01-01`);
        this.to = new Date(`${process.env.MAX_YEAR}-12-31`);
    }
}
