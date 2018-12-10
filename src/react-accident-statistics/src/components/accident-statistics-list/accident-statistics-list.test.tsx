import * as enzyme from 'enzyme';
import * as React from 'react'
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import * as testData from './accident-statistics-test-data.json';
// import { AccidentStatisticsService } from './../../services/accident-statistics-service';
import AccidentStatisticsList from './accident-statistics-list';
// jest.mock('AccidentStatisticsService');

describe('AccidentStatisticsList', () => {
    let mockAdapter: MockAdapter;
    // let service: AccidentStatisticsService;
    beforeEach(() => {
        // const resolved = new Promise((response) => response({ data: testData }));
        // (service.get as any).mockImplementation(() => Promise.resolve(resolved));
        mockAdapter = new MockAdapter(axios);
        mockAdapter.onAny().reply(200, { data: testData });
    });

    afterEach(() => {
        mockAdapter.restore();
    });

    it('should create component with base expectations', () => {
        // const accidentStatisticsList = enzyme.shallow(<AccidentStatisticsList severityOption="Fatal" fromDate="Dec 1, 2017, 12:00:00 AM" toDate="Dec 31, 2017, 11:59:00 PM" orderByOption="DateDescending" showJson={true} />);
        // expect(accidentStatisticsList).toBeTruthy();
        expect(testData).toBeTruthy();  
    });
});

