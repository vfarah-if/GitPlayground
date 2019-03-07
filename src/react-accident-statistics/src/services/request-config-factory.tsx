import { AccidentStatisticsQuery } from '../models';

export class RequestConfigFactory {
    static createSearchParams(query?: AccidentStatisticsQuery): URLSearchParams {
        const params = new URLSearchParams();
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
        return params;
    }
}