import { shallow } from 'enzyme';

import HelloWorld from './HelloWorld';

function paragraphElement(compiled) {
    return compiled.find('section.hello-world>p');
}

describe('HelloWorld', () => {

    it('should create component', () => {
        const compiled = shallow(<HelloWorld />);
        expect(compiled).toBeTruthy();
    });

    it('should contain Hello World', () => {
        const compiled = shallow(<HelloWorld />);

        const element = paragraphElement(compiled);
        console.log(element);
        expect(element.text()).toContain('Hello World');
    });
});
