import * as React from 'react'
import * as enzyme from 'enzyme';

import * as testData from '../accident-statistics-test-data.json';
import AccidentTitle from './accident-title';
import { PagedAccidentStatistic } from '../../models';

describe('AccidentTitle', () => {
    let wrapper;
    let pagedData: PagedAccidentStatistic;
    let fromDate:Date, toDate: Date;

    beforeEach(() => {
        pagedData = ((testData as any) as PagedAccidentStatistic);
        fromDate = new Date('Dec 1, 2017, 12:00:00 AM');
        toDate = new Date('Dec 31, 2017, 11:59:00 PM');
    });
    
    it('should default component with expectations', () => {
        wrapper = enzyme.shallow(<AccidentTitle/>)
        expect(pagedData).toBeTruthy();
        expect(wrapper.find('h1').length).toBe(1);
    });

    it('should describe the two fatal acidents', () => {
        wrapper = enzyme.shallow(<AccidentTitle total={pagedData.total} severityOption={'Fatal'}/>)
        expect(pagedData).toBeTruthy();
        expect(pagedData.total).toBe(2);
        expect(wrapper.find('h1').text()).toContain('Loading 2 fatal accidents list');
    });

    it('should mention the from and to date of the fatal accident', () => {
        wrapper = enzyme.mount(<AccidentTitle total={pagedData.total} severityOption={'Fatal'} from={fromDate} to={toDate}/>)
        expect(wrapper.find('h1').text()).toContain('from Fri Dec 01 2017 12:00:00 AM to Sun Dec 31 2017 11:59:00 PM');
    });

    it('should mention the default order by date', () => {
        wrapper = enzyme.shallow(<AccidentTitle total={pagedData.total} severityOption={'Fatal'} from={fromDate} to={toDate}/>)
        expect(wrapper.find('h1').text()).toContain('ordered by datedescending');
    });

    it('should mention the custom order by location descending', () => {
        wrapper = enzyme.shallow(<AccidentTitle total={pagedData.total} severityOption={'Fatal'} from={fromDate} to={toDate} orderByOption={'LocationDescending'}/>)
        expect(wrapper.find('h1').text()).toContain('ordered by locationdescending');
    });

    it('should mention the custom order by location descending', () => {
        wrapper = enzyme.mount(<AccidentTitle total={pagedData.total} severityOption={'Serious'} from={fromDate} to={toDate} orderByOption={'BoroughAscending'}/>)
        expect(wrapper.find('h1').text()).toContain('Loading 2 serious accidents list from Fri Dec 01 2017 12:00:00 AM to Sun Dec 31 2017 11:59:00 PM, ordered by boroughascending');
    });
});