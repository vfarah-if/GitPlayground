import { SeverityOptions, SortByOptions, AccidentStatisticsQuery } from './../models';
import { RequestConfigFactory } from './request-config-factory';

describe("RequestConfigFactory", () => {
    it("should create search params with all the configured values", () => {
        const fromDate = new Date(2014, 1, 1);
        const toDate = new Date(2018, 12, 31);
        const severity: SeverityOptions = 'Serious';
        const sortBy: SortByOptions = 'DateAscending';
        const currentPage = 2;
        const pageSize = 200;        
        const query: AccidentStatisticsQuery = {
            from: fromDate,
            to: toDate,
            severity: severity,
            sortBy: sortBy,
            page: currentPage,
            pageSize: pageSize,
        };        
        
        const actual: URLSearchParams = RequestConfigFactory.createSearchParams(query);
        
        expect(actual).toBeTruthy();
        expect(actual.has("from")).toBeTruthy();
        expect(actual.has("to")).toBeTruthy();
        expect(actual.has("severity")).toBeTruthy();
        expect(actual.has("sortBy")).toBeTruthy();
        expect(actual.has("page")).toBeTruthy();
        expect(actual.has("pageSize")).toBeTruthy();
    });
});