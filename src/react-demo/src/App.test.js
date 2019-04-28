import React from 'react';
import { shallow } from 'enzyme';
import ReactDOM from 'react-dom';

import App from './App';
// import HelloWorldUsersService from './api/HelloWorldUsersService';

function helloWorldElements(compiled) {
  return compiled.find('HelloWorld');
}

describe('App', () => {
  // beforeAll(() => {
  //   // TODO: Figure out how I could have got this to work
  //   jest.mock('HelloWorldUsersService');
  //   HelloWorldUsersService.getAllUsers.mockResolvedValue(['Samuel']);
  // });

  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<App />, div);
    ReactDOM.unmountComponentAtNode(div);
  });

  it('should contain several hello world components', () => {
    const compiled = shallow(<App />);
    // Set the users as if the service had resolved this   
    const users = ['Samuel'];
    compiled.setState({users})
    const elements = helloWorldElements(compiled);
        
    expect(elements.length).toBe(3);
  }); 
});
