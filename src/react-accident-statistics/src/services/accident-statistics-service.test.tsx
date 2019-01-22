import axios from 'axios';

import * as testData from './accident-statistics-service.json';
import { AccidentStatisticsService } from './accident-statistics-service';
import { SeverityOptions, SortByOptions, AccidentStatisticsQuery } from 'src/models';
jest.mock('axios');

describe('AccidentStatisticsService', () => {
    let service: AccidentStatisticsService;
    beforeEach(() => {
        service = new AccidentStatisticsService();        
    });

    it('should create test with all expectations', () => {
        expect(testData).toBeTruthy();
        expect(service).toBeTruthy();
    });

    it('should call axios with the v2 accidents path and parameters', async () => {
        const fromDate = new Date(2014, 1, 1);
        const toDate = new Date(2018, 12, 31);
        const severity: SeverityOptions = 'Serious';
        const sortBy: SortByOptions = 'DateAscending';
        const currentPage = 2;
        const pageSize = 200;
        const useV1 = false;
        const query: AccidentStatisticsQuery = {
            from: fromDate,
            to: toDate,
            severity: severity,
            sortBy: sortBy,
            page: currentPage,
            pageSize: pageSize,
            useV1: useV1
        };

        const resolved = new Promise((response) => response({ data: testData }));
        (axios.get as any).mockImplementation(() => Promise.resolve(resolved));
        const response = await service.get(query);

        expect(response).toBeTruthy();
        expect(axios.get).toHaveBeenCalled();
        expect(axios.get).toHaveBeenCalledWith("http://localhost:9000/v2/Accidents",
            {
                "headers": {
                    "headers": {
                        "Accept": "application/json",
                        "Content-Type": "application/json"
                    }
                }, "params": {
                    "__URLSearchParams__": {
                        "from": ["2014-02-01T00:00:00.000Z"],
                        "page": ["2"],
                        "pageSize": ["200"],
                        "severity": ["Serious"],
                        "sortBy": ["DateAscending"],
                        "to": ["2019-01-31T00:00:00.000Z"]
                    }
                }
            });
    });

    it('should call axios with the v1 accidents path and parameters', async () => {
        const fromDate = new Date(2014, 1, 1);
        const toDate = new Date(2018, 12, 31);
        const severity: SeverityOptions = 'Serious';
        const sortBy: SortByOptions = 'DateAscending';
        const currentPage = 2;
        const pageSize = 200;
        const useV1 = true;
        const query: AccidentStatisticsQuery = {
            from: fromDate,
            to: toDate,
            severity: severity,
            sortBy: sortBy,
            page: currentPage,
            pageSize: pageSize,
            useV1: useV1
        };
                
        const resolved = new Promise((response) => response({ data: testData }));
        (axios.get as any).mockImplementation(() => Promise.resolve(resolved));        
        const response = await service.get(query);

        expect(response).toBeTruthy();
        expect(axios.get).toHaveBeenCalled();
        expect(axios.get).toHaveBeenCalledWith("http://localhost:9000/v1/Accidents",
            {
                "headers": {
                    "headers": {
                        "Accept": "application/json",
                        "Content-Type": "application/json"
                    }
                }, "params": {
                    "__URLSearchParams__": {
                        "from": ["2014-02-01T00:00:00.000Z"],
                        "page": ["2"],
                        "pageSize": ["200"],
                        "severity": ["Serious"],
                        "sortBy": ["DateAscending"],
                        "to": ["2019-01-31T00:00:00.000Z"]
                    }
                }
            });
    });
});