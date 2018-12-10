import * as React from 'react';
import * as enzyme from 'enzyme';

import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import * as testData from './app-test-data.json';

import App from './App';

describe('App', () => {
  let wrapper;
  let mockAdapter: MockAdapter;

  beforeEach(() => {
    mockAdapter = new MockAdapter(axios);
    mockAdapter.onAny().reply(200, { data: testData });
  });

  afterEach(() => {
    mockAdapter.restore();
  });

  it('renders without crashing', () => {    
    wrapper = enzyme.shallow(<App />);
    
    expect(testData).toBeTruthy();
    expect(testData.data).toBeTruthy();    
    expect(wrapper).toBeTruthy();
  });
});
