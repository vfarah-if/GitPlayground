import * as React from 'react'
import * as enzyme from 'enzyme';

import * as testData from './accident-statistics-test-data.json';
import AccidentOrderedList from './accident-ordered-list';
import { AccidentStatistic } from './../../models';

describe('AccidentOrderedList', () => {
    let wrapper;
    let accidentStatistics: Array<AccidentStatistic>;

    beforeEach(() => {
        accidentStatistics = testData.data as Array<AccidentStatistic>;
    });
    
    it('should create component with several order list accident list items', () => {
        wrapper = enzyme.shallow(<AccidentOrderedList accidentStatistics={accidentStatistics} showJson={true} />)
        expect(testData).toBeTruthy();
        expect(testData.data).toBeTruthy();
        expect(wrapper.find('ol AccidentListItem').length).toBe(testData.data.length);
    });
});