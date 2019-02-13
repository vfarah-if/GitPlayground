
import { AccidentsQuery, AccidentStatistic } from "./../../../models";

export class TransportForLondonClient {
    public getAccidentStatistics(
        from: Date | undefined,
        to: Date | undefined,
        severity: string | undefined,
        orderBy: string,
        page: number | undefined,
        pageSize: number | undefined): AccidentStatistic[] | PromiseLike<AccidentStatistic[]> {
        throw new Error("Method not implemented.");
        // TODO: Hook up Axios to call the TFL api by each year and expose a generic predicate mechanism
        // that can filter and sort and skip and take data generically
    }

}
