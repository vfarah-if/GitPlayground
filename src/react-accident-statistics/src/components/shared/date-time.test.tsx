import * as React from 'react'
import * as enzyme from 'enzyme';

import { DateTime } from './date-time';

describe('DateTime', () => {
    let wrapper;
   
    it('should default component with expectations', () => {
        wrapper = enzyme.shallow(<DateTime/>)
        expect(wrapper.text()).toBe("");
    });

    it('should display as the HTML 5 time element formatted as expected', () => {
        wrapper = enzyme.shallow(<DateTime date={'Dec 1, 2017, 12:00:00 AM'}/>)
        expect(wrapper.html()).toBe('<time dateTime=\"2017-12-01T00:00:00.000Z\">Fri Dec 01 2017 12:00:00 AM</time>');
    });

    it('should display a string value as expected', () => {
        wrapper = enzyme.shallow(<DateTime date={'Dec 1, 2017, 12:00:00 AM'}/>)
        expect(wrapper.find('time').text()).toBe('Fri Dec 01 2017 12:00:00 AM');
    });

    it('should display a date element as expected', () => {
        const date = new Date('Dec 1, 2017, 12:00:00 AM');
        wrapper = enzyme.shallow(<DateTime date={date}/>)
        expect(wrapper.find('time').text()).toBe('Fri Dec 01 2017 12:00:00 AM');
    });

    it('should display a numeric value as expected', () => {
        const beginningOfDateAsNumber = 1;
        wrapper = enzyme.shallow(<DateTime date={beginningOfDateAsNumber}/>)
        expect(wrapper.find('time').text()).toBe('Thu Jan 01 1970 1:00:00 AM');
    });

});