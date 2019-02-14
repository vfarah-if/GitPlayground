import {
    AccidentsQuery,
    AccidentStatistic,
    Paging,
    SortByOptions
} from "./../../../models";

export class TransportForLondonClient {

    public async getAccidentStatisticsByQuery(query: AccidentsQuery): Promise<Paging<AccidentStatistic>> {
        if (!query) {
            query = new AccidentsQuery();
        }
        return await this.getAccidentStatistics(
            query.from,
            query.to,
            query.severity,
            query.sortBy,
            query.page,
            query.pageSize
        );
    }

    public async getAccidentStatistics(
        from: Date,
        to: Date,
        severity: string,
        sortBy: SortByOptions,
        page: number,
        pageSize: number): Promise<Paging<AccidentStatistic>> {

        const maxYear = Number(process.env.MAX_YEAR);

        if (!from) {
            this.raiseRequired("from");
        }

        if (from && from.getFullYear() < 2005) {
            this.raiseDataBelow2005();
        }

        if (from && from.getFullYear() > maxYear) {
            this.raiseMaxYearNotSupported(maxYear);
        }

        if (!to) {
            this.raiseRequired("to");
        }

        if (to && to.getFullYear() < 2005) {
            this.raiseDataBelow2005();
        }

        if (to && to.getFullYear() > maxYear) {
            this.raiseMaxYearNotSupported(maxYear);
        }

        if (!severity) {
            this.raiseRequired("severity");
        }

        if (!sortBy) {
            this.raiseRequired("sortBy");
        }

        if (!page) {
            this.raiseRequired("page");
        }

        if (!pageSize) {
            this.raiseRequired("pageSize");
        }
        // tslint:disable-next-line:no-console
        console.log("Retrieving year data from cache or TFL live site");
        // TODO: Hook up Axios to call the TFL api by each year and expose a generic predicate mechanism
        // that can filter and sort and skip and take data generically
        const result = new Paging<AccidentStatistic>();
        return Promise.resolve<Paging<AccidentStatistic>>(result);
    }

    private raiseDataBelow2005() {
        throw new Error("No data below 2005");
    }

    private raiseMaxYearNotSupported(maxYear: number) {
        throw new Error(`No data greater than '${maxYear}'`);
    }

    private raiseRequired(field: string) {
        throw new Error(`'${field}' must have a value`);
    }
}
