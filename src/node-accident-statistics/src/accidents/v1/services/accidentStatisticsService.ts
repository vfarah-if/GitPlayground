import { TransportForLondonClient } from "../client/transportForLondonClient";
import { AccidentsQuery, AccidentStatistic, Paging } from "./../../../models";

export class AccidentStatisticsService {
    public transportForLondonClient = new TransportForLondonClient();
    public async get(query: AccidentsQuery): Promise<Paging<AccidentStatistic>> {
        return await this.transportForLondonClient.getAccidentStatisticsByQuery(query);
    }
}
