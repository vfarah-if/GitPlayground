import * as React from 'react'
import * as enzyme from 'enzyme';

import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

import * as testData from './accident-statistics-test-data.json';
import AccidentStatisticsList from './accident-statistics-list';
import { AccidentStatisticsService } from 'src/services/accident-statistics-service';

// jest.mock('AccidentStatisticsService');

describe('AccidentStatisticsList', () => {
    let mockAdapter: MockAdapter;
    let wrapper;

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

    it('should create component with base expectations', async() => {
        const spy = jest.spyOn(AccidentStatisticsService.prototype, 'get');
        wrapper = enzyme.shallow(<AccidentStatisticsList severityOption="Fatal" fromDate="Dec 1, 2017, 12:00:00 AM" toDate="Dec 31, 2017, 11:59:00 PM" orderByOption="DateDescending" showJson={true} />)
        expect(spy).toHaveBeenCalled();
        expect(testData).toBeTruthy();
        expect(testData.data).toBeTruthy();
        expect(wrapper).toBeTruthy();
    });
});

