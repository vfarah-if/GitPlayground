import { TransportForLondonClient } from "../client/transportForLondonClient";
import { AccidentsQuery, AccidentStatistic } from "./../../../models";

export class AccidentStatisticsService {
    public async get(query: AccidentsQuery): Promise<AccidentStatistic[]> {
        const maxYear = Number(process.env.MAX_YEAR);

        if (query.from && query.from.getFullYear() < 2005) {
            this.raiseNoDataBelow2005();
        }

        if (query.from && query.from.getFullYear() > maxYear) {
            this.raiseMaxYearNotSupported(maxYear);
        }

        if (query.to && query.to.getFullYear() < 2005) {
            this.raiseNoDataBelow2005();
        }

        if (query.to && query.to.getFullYear() > maxYear) {
            this.raiseMaxYearNotSupported(maxYear);
        }

        const client = new TransportForLondonClient();
        return await client.getAccidentStatistics(
            query.from,
            query.to,
            query.severity,
            query.orderBy,
            query.page,
            query.pageSize);

        // TODO: Implement a TFLClient returning accident statistics from the live server based on the requirements
        // return Promise.resolve<AccidentStatistic[]>(new Array<AccidentStatistic>());
    }

    private raiseNoDataBelow2005() {
        throw new Error("No data below 2005");
    }

    private raiseMaxYearNotSupported(maxYear: number) {
        throw new Error(`No data greater than '${maxYear}'`);
    }
}
