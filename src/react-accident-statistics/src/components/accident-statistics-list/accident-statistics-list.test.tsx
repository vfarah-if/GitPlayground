import * as React from 'react'
import * as enzyme from 'enzyme';

import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

import * as testData from './accident-statistics-test-data.json';
import AccidentStatisticsList from './accident-statistics-list';
import { AccidentStatisticsService } from './../../services';
import { DEFAULT_FROM_DATE } from '../constants';

describe('AccidentStatisticsList', () => {
    let mockAdapter: MockAdapter;
    let wrapper;

    describe('default settings', () => {
        beforeEach(() => {
            mockAdapter = new MockAdapter(axios);
            mockAdapter.onAny().reply(200, testData);
        });

        afterEach(() => {
            mockAdapter.restore();
        });

        it('should create component with default expectations', async () => {
            wrapper = enzyme.shallow(<AccidentStatisticsList />)
            const expectedInitialState = {
                accidentStatistics: [],
                from: DEFAULT_FROM_DATE,
                orderByOption: 'DateDescending',
                pageSize: 500,
                pagedAccidentStatistic: undefined,
                severityOption: 'Fatal',
                showJson: false,
                to: new Date('2017-12-31T12:00:00.000Z')
            };

            expect(testData).toBeTruthy();
            expect(testData.data).toBeTruthy();
            expect(wrapper).toBeTruthy();
            const actualState = wrapper.state();
            expect(actualState).toMatchObject(expectedInitialState);
        });

        it('should call the service once with expected arguments', async () => {
            const spyOnGet = jest.spyOn(AccidentStatisticsService.prototype, 'get');
            wrapper = enzyme.mount(<AccidentStatisticsList />)
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
            wrapper = enzyme.shallow(<AccidentStatisticsList />)
            const header = wrapper.find('section > AccidentTitle');
            expect(header.length).toBe(1);
            expect(header.text()).toBe('<AccidentTitle />');
        });

        it('should contain an accident order list', () => {
            wrapper = enzyme.shallow(<AccidentStatisticsList />)
            const orderList = wrapper.find('section > AccidentOrderedList');
            expect(orderList.length).toBe(1);
            expect(orderList.text()).toBe('<AccidentOrderedList />');
        });
    });
});

