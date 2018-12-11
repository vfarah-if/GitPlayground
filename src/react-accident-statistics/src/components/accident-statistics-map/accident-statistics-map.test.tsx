import * as React from 'react'
import * as enzyme from 'enzyme';

import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

import * as testData from './../accident-statistics-test-data.json';
import { DEFAULT_FROM_DATE } from '../constants';
import { AccidentStatisticsService } from './../../services';
import  AccidentStatisticsMap  from '../accident-statistics-map/accident-statistics-map';


describe('AccidentStatisticsMap', () => {
    let mockAdapter: MockAdapter;
    let mapWrapper;

    describe('default settings', () => {

        beforeEach(() => {
            mockAdapter = new MockAdapter(axios);
            mockAdapter.onAny().reply(200, testData);
        });

        afterEach(() => {
            mockAdapter.restore();
        });

        it('should create component with default expectations', async () => {
            mapWrapper = enzyme.shallow(<AccidentStatisticsMap />)
            const expectedInitialState = {
                accidentStatistics: [],
                from: DEFAULT_FROM_DATE,
                orderByOption: 'DateDescending',
                pageSize: 500,
                pagedAccidentStatistic: undefined,
                severityOption: 'Fatal',
                to: new Date('2017-12-31T12:00:00.000Z'),
                imageOption: 'Macarbe',
                zoom: 9,
            };

            expect(testData).toBeTruthy();
            expect(testData.data).toBeTruthy();
            expect(mapWrapper).toBeTruthy();
            const actualState = mapWrapper.state();
            expect(actualState).toMatchObject(expectedInitialState);
        });

        it('should call the service once with expected arguments', async () => {
            const spyOnGet = jest.spyOn(AccidentStatisticsService.prototype, 'get');
            mapWrapper = enzyme.mount(<AccidentStatisticsMap />)
            const expectedQueryParams = {
                from: DEFAULT_FROM_DATE,
                page: 1,
                pageSize: 500,
                severity: 'Fatal',
                sortBy: 'DateDescending',
                to: new Date('2017-12-31T12:00:00.000Z')
            };

            expect(spyOnGet).toHaveBeenCalledTimes(1);
            expect(spyOnGet).toHaveBeenCalledWith(expectedQueryParams);
        });

        it('should contain an accident title component', () => {
            mapWrapper = enzyme.shallow(<AccidentStatisticsMap />)
            const header = mapWrapper.find('section > AccidentTitle');
            expect(header.length).toBe(1);
            expect(header.text()).toBe('<AccidentTitle />');
        });
    });
});