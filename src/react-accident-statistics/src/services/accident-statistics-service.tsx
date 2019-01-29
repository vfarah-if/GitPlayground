import axios, { AxiosResponse } from 'axios';

import { PagedAccidentStatistic, AccidentStatisticsQuery } from 'src/models';

export class AccidentStatisticsService {
    private basePath:string = 'http://localhost:9000'; // TODO: hook this up with environment variables

    public async get(query?: AccidentStatisticsQuery): Promise<AxiosResponse<PagedAccidentStatistic>> {
        var params = new URLSearchParams();
        if (query) {
            if (query.from) {
                params.append('from', query.from.toISOString());
            }
            if (query.to) {
                params.append('to', query.to.toISOString());
            }

            if (query.severity) {
                params.append('severity', query.severity);
            }

            if (query.sortBy) {
                params.append('sortBy', query.sortBy);
            }

            if (query.page) {
                params.append('page', query.page.toString());
            }

            if (query.pageSize) {
                params.append('pageSize', query.pageSize.toString());
            }
        }
        const headers = {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        }
        const url = query && query.useV1 ? `${this.basePath}/v1/Accidents` : `${this.basePath}/v2/Accidents`;
        return await axios.get(url, { params: params, headers: headers });
    }
}