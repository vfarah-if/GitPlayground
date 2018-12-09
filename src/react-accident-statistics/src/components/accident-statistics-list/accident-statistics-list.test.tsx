import axios from 'axios';
import * as enzyme from 'enzyme';
import * as React from 'react'

import * as testData from './accident-statistics-test-data.json';
import AccidentStatisticsList from './accident-statistics-list';
jest.mock('axios');

describe('AccidentStatisticsList', () => {    
    beforeEach(() => {
        const resolved = new Promise((response) => response({ data: testData }));
        (axios.get as any).mockImplementation(() => Promise.resolve(resolved));
    });

    it('should create component with base expectations', () => {
        const accidentStatisticsList = enzyme.shallow(<AccidentStatisticsList severityOption="Fatal" fromDate="Dec 1, 2017, 12:00:00 AM" toDate="Dec 31, 2017, 11:59:00 PM" orderByOption="DateDescending" showJson={true}/>);
        expect(accidentStatisticsList).toBeTruthy();
    });
});

