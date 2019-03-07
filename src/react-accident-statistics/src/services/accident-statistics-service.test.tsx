import axios from 'axios';

import * as testData from './accident-statistics-service.json';
import { AccidentStatisticsService } from './accident-statistics-service';
import { SeverityOptions, SortByOptions, AccidentStatisticsQuery } from 'src/models';
import { RequestConfigFactory } from './request-config-factory';
jest.mock('axios');

describe('AccidentStatisticsService', () => {
    let service: AccidentStatisticsService;
    const expectedHeaders = {
        "headers": {
            "Accept": "application/json",
            "Content-Type": "application/json"
        }
    };

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
        const expectedUrl = "http://localhost:9000/v2/Accidents";              
        const params = RequestConfigFactory.createSearchParams(query);
        const expectedConfig = {
            "headers": expectedHeaders,
            "params": params
        };  

        const resolved = new Promise((response) => response({ data: testData }));
        (axios.get as any).mockImplementation(() => Promise.resolve(resolved));
        const response = await service.get(query);

        expect(response).toBeTruthy();
        expect(axios.get).toHaveBeenCalled();
        expect(axios.get).toHaveBeenCalledWith(expectedUrl, expectedConfig);
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
        const expectedUrl = "http://localhost:9000/v1/Accidents";
        const params = RequestConfigFactory.createSearchParams(query);
        const expectedConfig = {
            "headers": expectedHeaders,
            "params": params
        };

        const resolved = new Promise((response) => response({ data: testData }));
        (axios.get as any).mockImplementation(() => Promise.resolve(resolved));
        const response = await service.get(query);

        expect(response).toBeTruthy();
        expect(axios.get).toHaveBeenCalled();
        expect(axios.get).toHaveBeenCalledWith(expectedUrl, expectedConfig);
    });
});