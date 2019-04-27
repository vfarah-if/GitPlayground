import { mount, shallow } from 'enzyme';

import HelloWorld from './HelloWorld';

function paragraphElement(compiled) {
    return compiled.find('section.hello-world>p');
}

function shoutElement(compiled) {
    return compiled.find('Shout');
}

describe('HelloWorld', () => {
    let compiled;

    it('should create component', () => {
        compiled = mount(<HelloWorld />);
        expect(compiled).toBeTruthy();
    });

    it('should contain Shout Component', () => {
        compiled = shallow(<HelloWorld/>);
        const element = shoutElement(compiled);
        expect(element).toBeTruthy();
    });

    it('should contain Hello WORLD!', () => {
        compiled = mount(<HelloWorld />);
        const element = paragraphElement(compiled);    
        expect(element.text()).toContain('Hello WORLD!');
    });

    it('should contain Hello VINCENT!', () => {
        compiled = mount(<HelloWorld who="Vincent" />);
        const element = paragraphElement(compiled);
        expect(element.text()).toContain('Hello VINCENT!');
    });
});
