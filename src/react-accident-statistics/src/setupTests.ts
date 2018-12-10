import './Polyfill';
import * as React from 'react'
import * as enzyme from 'enzyme';
import * as Adapter from 'enzyme-adapter-react-16';

enzyme.configure({ adapter: new Adapter() });

global.React = React;
global.shallow = enzyme.shallow;
global.mount = enzyme.mount;

global.flushPromises = () => new Promise(resolve => setImmediate(resolve))
