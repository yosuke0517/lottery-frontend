import React from 'react';
import logo from './logo.svg';
import './App.css';
import { LotoSevenList } from './components/lotoSevenList';

const App = () => (
  <div className="App">
    <header className="App-header">
      <img src={logo} className="App-logo" alt="logo" />
      <LotoSevenList />
    </header>
  </div>
);

export default App;
