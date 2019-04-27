import React, { Component } from 'react';
import { shallow } from 'enzyme';

import Shout from './Shout';

describe('Shout', () => {

    it('should shout out text with an excalamation', () => {
        const compiled = shallow(<Shout what="Hello"/>)
        expect(compiled).toBeTruthy();        
        expect(compiled.text()).toBe('HELLO!');
    })
})
