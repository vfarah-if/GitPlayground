import * as React from 'react'
import * as enzyme from 'enzyme';

import * as testData from './accident-statistics-test-data.json';
import AccidentListItem from './accident-list-item';
import { AccidentStatistic } from './../../models';

describe('AccidentListItem', () => {
    let wrapper;
    let firstAccidentStatistic: AccidentStatistic, secondAccidentStatistic: AccidentStatistic;

    beforeEach(() => {
        firstAccidentStatistic = testData.data[0] as AccidentStatistic;
        secondAccidentStatistic = testData.data[1] as AccidentStatistic;
    });

    it('should create a list item with all expectations', () => {
        wrapper = enzyme.shallow(<AccidentListItem accidentStatistic={firstAccidentStatistic} showJson={true} />)
        expect(wrapper.find('li')).toBeDefined();
    });

    it('should generate id information', () => {
        wrapper = enzyme.shallow(<AccidentListItem accidentStatistic={firstAccidentStatistic} showJson={true} />)
        expect(wrapper.find('li mark').text()).toContain(firstAccidentStatistic.id);
    });

    it('should generate date time information', () => {
        if (firstAccidentStatistic && firstAccidentStatistic.date) {
            const expectedDate = new Date(firstAccidentStatistic.date).toDateString();
            const expectedTime = new Date(firstAccidentStatistic.date).toLocaleTimeString('en-US')

            wrapper = enzyme.mount(<AccidentListItem accidentStatistic={firstAccidentStatistic} showJson={true} />)
            expect(wrapper.find('DateTime').text()).toContain(expectedDate);
            expect(wrapper.find('DateTime').text()).toContain(expectedTime);
        }
    });

    it('should generate location information', () => {
        wrapper = enzyme.shallow(<AccidentListItem accidentStatistic={firstAccidentStatistic} showJson={true} />)
        expect(wrapper.find('li').text()).toContain(firstAccidentStatistic.location);
    });

    it('should generate borough information', () => {
        wrapper = enzyme.shallow(<AccidentListItem accidentStatistic={firstAccidentStatistic} showJson={true} />)
        expect(wrapper.find('li').text()).toContain(firstAccidentStatistic.borough);
    });

    it('should create 2 casualties in plural form', () => {
        wrapper = enzyme.shallow(<AccidentListItem accidentStatistic={firstAccidentStatistic} showJson={true} />)
        expect((firstAccidentStatistic.casualties?firstAccidentStatistic.casualties.length:0)).toBe(2);
        expect(wrapper.find('li span.casualty.hidden')).toBeDefined();
    });

    it('should create 1 casualty in singular form', () => {
        wrapper = enzyme.shallow(<AccidentListItem accidentStatistic={secondAccidentStatistic} showJson={true} />)
        expect((secondAccidentStatistic.casualties?secondAccidentStatistic.casualties.length:0)).toBe(1);
        expect(wrapper.find('li span.casualties.hidden')).toBeDefined();
    });

    it('should create 2 vehicles in plural form', () => {
        wrapper = enzyme.shallow(<AccidentListItem accidentStatistic={firstAccidentStatistic} showJson={true} />)
        expect((firstAccidentStatistic.vehicles?firstAccidentStatistic.vehicles.length:0)).toBe(2);
        expect(wrapper.find('li span.vehicle.hidden').length).toEqual(1);
    });

    it('should create 1 vehicle in singular form', () => {
        wrapper = enzyme.shallow(<AccidentListItem accidentStatistic={secondAccidentStatistic} showJson={true} />)
        expect((secondAccidentStatistic.vehicles?secondAccidentStatistic.vehicles.length:0)).toBe(1);
        expect(wrapper.find('li span.vehicles.hidden').length).toEqual(1);
    });

    it('should create casualty details', () => {
        wrapper = enzyme.shallow(<AccidentListItem accidentStatistic={firstAccidentStatistic} showJson={true} />)
        expect(wrapper.find('CasualtyDetailList').length).toBe(1);
    });

    it('should show json details', () => {
        wrapper = enzyme.shallow(<AccidentListItem accidentStatistic={firstAccidentStatistic} showJson={true} />)
        expect(wrapper.find('pre').length).toBe(1);
    });

    it('should hide json details', () => {
        wrapper = enzyme.shallow(<AccidentListItem accidentStatistic={firstAccidentStatistic} showJson={false} />)
        expect(wrapper.find('pre.hidden').length).toBe(1);
    });
});