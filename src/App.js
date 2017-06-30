import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import DynamicProgramming from './dynamic-programming/dynamic_programming'

class App extends Component {
  render() {
    return (
      <div className="App">
        <DynamicProgramming />
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to React</h2>
        </div>
      </div>
    );
  }
}

export default App;
