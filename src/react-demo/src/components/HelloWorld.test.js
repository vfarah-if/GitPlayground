import { shallow } from 'enzyme';

import HelloWorld from './HelloWorld';

function paragraphElement(compiled) {
    return compiled.find('section.hello-world>p');
}

describe('HelloWorld', () => {
    let compiled;

    beforeEach(() => {
        compiled = shallow(<HelloWorld />);
    });

    it('should create component', () => {
        expect(compiled).toBeTruthy();
    });

    it('should contain Hello World', () => {
        const element = paragraphElement(compiled);
        console.log(element);
        expect(element.text()).toContain('Hello World');
    });
});
