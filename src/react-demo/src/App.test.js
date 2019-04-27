import React from 'react';
import { shallow } from 'enzyme';
import ReactDOM from 'react-dom';
import App from './App';
import HelloWorldUsersService from './api/HelloWorldUsersService';

function helloWorldElements(compiled) {
  return compiled.find('HelloWorld');
};

describe('App', () => {
  beforeAll(() => {
    jest.mock('HelloWorldUsersService');
    HelloWorldUsersService.getAllUsers.mockResolvedValue(['Gabriel']);
  });

  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<App />, div);
    ReactDOM.unmountComponentAtNode(div);
  });

  it('should contain several hello world components', () => {
    const compiled = shallow(<App />)
    const elements = helloWorldElements(compiled);
    console.log(elements);
    expect(elements.length).toBe(2);
  })
})

