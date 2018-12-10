import * as React from 'react'
import * as enzyme from 'enzyme';

import * as testData from './accident-statistics-test-data.json';
import CasualtyDetailList from './casualty-detail-list';
import { AccidentStatistic } from './../../models';

describe('CasualtyDetailList', () => {
    let wrapper;
    let accidentStatistic: AccidentStatistic;

    beforeEach(() => {
        accidentStatistic = testData.data[0] as AccidentStatistic;
    });

    it('should create component with default expectations', () => {
        wrapper = enzyme.shallow(<CasualtyDetailList />)
        expect(accidentStatistic).toBeTruthy();
        expect(wrapper.find('dl').length).toBe(1);
        expect(wrapper.find('dl dt').length).toBe(0);
    });
    
    it('should create component with two casualty detail lists', () => {
        wrapper = enzyme.shallow(<CasualtyDetailList casualties={accidentStatistic.casualties} />)
        expect(wrapper.find('dl dt').length).toBe(2);
    });

    it('should create two font awesome icons', () => {
        wrapper = enzyme.shallow(<CasualtyDetailList casualties={accidentStatistic.casualties} />)
        expect(wrapper.find('dl dt FontAwesomeIcon').length).toBe(2);
    });

    it('should create contain casualty information of severity and age', () => {
        wrapper = enzyme.shallow(<CasualtyDetailList casualties={accidentStatistic.casualties} />)
        expect(wrapper.find('dl dt span').first().text()).toContain('Casualty 1 of slight severity, aged 2');
    });
});