import React from 'react';
import { shallow, mount } from 'enzyme';
import ReactDOM from 'react-dom';

import App from './App';
import HelloWorldUsersService from './api/HelloWorldUsersService';
jest.mock('./api/HelloWorldUsersService');

function helloWorldElements(compiled) {
  return compiled.find('HelloWorld');
}

describe('App', () => {
  beforeAll(() => {
    HelloWorldUsersService.getAllUsers.mockResolvedValue(['Samuel']);
  });


  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<App />, div);
    ReactDOM.unmountComponentAtNode(div);
  });

  it('should contain several hello world components', () => {
    const compiled = shallow(<App />);
    // Set the users as if the service had resolved this   
    const users = ['Samuel'];
    compiled.setState({ users })
    const elements = helloWorldElements(compiled);

    expect(elements.length).toBe(3);
  });

  it('should call the service and do the above test', async () => {
    const compiled = shallow(<App />);
    // facking time
    await compiled.instance().componentDidMount();
    expect(HelloWorldUsersService.getAllUsers).toHaveBeenCalled();

    // Refresh the react internals
    compiled.update();

    const elements = helloWorldElements(compiled);
    console.log('Assert')
    expect(elements.length).toBe(3);
  });
});
