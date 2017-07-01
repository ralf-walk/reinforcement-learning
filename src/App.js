import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import DynamicProgramming from './dynamic-programming/dynamic_programming'

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <h1>Dynamic Programming</h1>
        </div>
        <DynamicProgramming />
      </div>
    );
  }
}

export default App;
