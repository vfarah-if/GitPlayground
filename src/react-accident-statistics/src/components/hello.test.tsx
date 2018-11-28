import * as enzyme from 'enzyme';

import * as React from 'react'
import Hello from './hello';

describe('hello', () => {
    beforeEach(() => {
       console.log("before each ... "); 
    });

    beforeAll(() => {
        console.log("before all ... ");
    });

    afterEach(() => {
        console.log("after each ... ");
    });

    afterAll(() => {
        console.log("after all ... ");
    });

    it('should render the correct text when no enthusiasm level is given', () => {
        const hello = enzyme.shallow(<Hello name='Vincent' />);
        expect(hello.find(".greeting").text()).toEqual('Hello Vincent!')
    });

    it('should render the correct text with an explicit enthusiasm of 1', () => {
        const hello = enzyme.shallow(<Hello name='Vincent' enthusiasmLevel={1} />);
        expect(hello.find(".greeting").text()).toEqual('Hello Vincent!')
    });

    it('should render the correct text with an explicit enthusiasm level of 5', () => {
        const hello = enzyme.shallow(<Hello name='Vincent' enthusiasmLevel={5} />);
        expect(hello.find(".greeting").text()).toEqual('Hello Vincent!!!!!');
    });

    it('must throw when the enthusiasm level is 0', () => {
        expect(() => {
            enzyme.shallow(<Hello name='Vincent' enthusiasmLevel={0} />);
        }).toThrow();
    });

    it('must throw when the enthusiasm level is negative', () => {
        expect(() => {
            enzyme.shallow(<Hello name='Vincent' enthusiasmLevel={-1} />);
        }).toThrow();
    });
});

