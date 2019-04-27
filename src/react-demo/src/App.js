import React, { Component } from 'react';

import logo from './logo.svg';
import './App.css';
import HelloWorld from './components/HelloWorld';
import helloWorldUsersService  from './api/HelloWorldUsersService';

export default class App extends Component {

  abortController = new AbortController(); 

  constructor() {
    super();
    this.state = {
      users: []
    }
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a className="App-link" href="https://reactjs.org" target="_blank" rel="noopener noreferrer">Learn React</a>
        </header>
        <HelloWorld />
        <HelloWorld who="Vincent"></HelloWorld>
        {this.state.users.map((user) => <HelloWorld key={user} who={user}></HelloWorld>)}
      </div>
    );
  }

  async componentDidMount() {
    await this.loadAllUsers();
  }

  componentWillUnmount() {
    this.abortController.abort();
  }

  async loadAllUsers() {
    const signal = this.abortController.signal;
    console.log(signal);    
    const users = await helloWorldUsersService.getAllUsers();
    if (!signal.aborted) {
      this.setState({ users });
    }
  }  
}