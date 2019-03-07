import axios, { AxiosResponse } from 'axios';

import { PagedAccidentStatistic, AccidentStatisticsQuery } from './../models';
import { RequestConfigFactory } from './request-config-factory';

export class AccidentStatisticsService {
    private basePath:string = 'http://localhost:9000'; // TODO: hook this up with environment variables

    public async get(query?: AccidentStatisticsQuery): Promise<AxiosResponse<PagedAccidentStatistic>> {
        const params = RequestConfigFactory.createSearchParams(query);
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