import * as React from 'react'
import * as enzyme from 'enzyme';

import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

import * as testData from './../accident-statistics-test-data.json';
import { DEFAULT_FROM_DATE } from '../constants';
import { AccidentStatisticsService } from './../../services';
import AccidentStatisticsMap from '../accident-statistics-map/accident-statistics-map';
import { PagedAccidentStatistic } from './../../models';

describe('AccidentStatisticsMap', () => {

    describe('default settings', () => {
        let wrapper: any;
        let mockAdapter: MockAdapter;
        beforeEach(() => {
            mockAdapter = new MockAdapter(axios);
            mockAdapter.onAny().reply(200, testData);
        });

        afterEach(() => {
            mockAdapter.reset();
        });

        it('should create component with default expectations', () => {
            wrapper = enzyme.shallow(<AccidentStatisticsMap />)
            const expectedInitialState = {
                from: DEFAULT_FROM_DATE,
                orderByOption: 'DateDescending',
                pageSize: 500,
                pagedAccidentStatistic: undefined,
                severityOption: 'Fatal',
                to: new Date('2017-12-31T12:00:00.000Z'),
                imageOption: 'Macarbe',
                zoom: 9,
                latitude: 51.50608021,
                longitude: -0.12184322,
                maxZoom: 18,
                useGeolocationPosition: false,
                markers: [],
            };

            expect(testData).toBeTruthy();
            expect(testData.data).toBeTruthy();
            expect(wrapper).toBeTruthy();
            const actualState = wrapper.state();
            expect(actualState).toMatchObject(expectedInitialState);
        });

        it('should call the service once with expected arguments', () => {
            const spyOnGet = jest.spyOn(AccidentStatisticsService.prototype, 'get');
            wrapper = enzyme.mount(<AccidentStatisticsMap />)
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

        it('should get expected data returned from axios for any get', () => {
            axios.get<PagedAccidentStatistic>('testAxios').then((result) => {
                expect(result.status).toBe(200);
                expect(result.data).toBeTruthy();
                expect(result.data.data).toBeTruthy();
                expect(result.data.pageSize).toBe(2)
                expect(result.data.data).toBeDefined();
                expect(result.data.data ? result.data.data.length : 0).toBe(2);
            })
        });

        it('should contain an accident title component', () => {
            wrapper = enzyme.shallow(<AccidentStatisticsMap />)
            const header = wrapper.find('section > AccidentTitle');
            expect(header.length).toBe(1);
            expect(header.text()).toBe('<AccidentTitle />');
        });

        it('should contain a map component', () => {
            wrapper = enzyme.shallow(<AccidentStatisticsMap />)
            const map = wrapper.find('section > Map');
            expect(map.length).toBe(1);
        });
    });

    describe('mount component test with non-default data', () => {
        let wrapper: enzyme.ReactWrapper;
        let mockAdapter: MockAdapter;
        let userPosition: Position;
        let geolocationSpy;
        beforeEach(async () => {
            mockAdapter = new MockAdapter(axios);
            mockAdapter.onAny().reply(200, testData);
            userPosition = { 
                coords: {                    
                    latitude: 60,
                    longitude: -1.12184322,
                    altitude: 73.27,
                    accuracy: 0.1,
                    altitudeAccuracy: 0.2,
                    heading: null,
                    speed: null
                },
                timestamp: 1
            };

            geolocationSpy = jest.spyOn(window.navigator.geolocation, 'getCurrentPosition');
            const mockCallback = jest.fn((callback) => callback(userPosition));
            geolocationSpy.mockImplementation(mockCallback);
            wrapper = enzyme.mount(<AccidentStatisticsMap fromDate="Jan 1, 2010, 12:00:00 AM" toDate="Dec 31, 2017, 11:59:00 PM" severityOption="Slight" imageOption="Friendly" zoom={11} orderByOption='BoroughAscending' pageSize={100} maxZoom={17} useGeolocationPosition={true} />);
        });

        afterEach(() => {
            mockAdapter.reset();
        });

        it('should contain expected state data', async () => {
            const expectedData = await axios.get<PagedAccidentStatistic>('testAxios');
            expect(expectedData).toBeDefined();
            const expectedInitialState = {
                orderByOption: 'BoroughAscending',
                pageSize: 100,
                pagedAccidentStatistic: expectedData.data,
                severityOption: 'Slight',
                imageOption: 'Friendly',
                zoom: 11,
                latitude: userPosition.coords.latitude,
                longitude: userPosition.coords.longitude,
                maxZoom: 17,
                useGeolocationPosition: true
            };
            const actualState = wrapper.state();
            expect(actualState).toMatchObject(expectedInitialState);
        })

        it('should call the windows navigator to get and set the current position of the user', async () => {
            const expectedData = await axios.get<PagedAccidentStatistic>('testAxios');
            expect(expectedData).toBeDefined();
            expect(window.navigator.geolocation.getCurrentPosition).toHaveBeenCalled();
        });
    });
});