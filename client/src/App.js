import React, { Component } from 'react';
import Home from './components/Home'
// import {  Provider } from "react-redux";
import 'bootstrap/dist/css/bootstrap.min.css'
import './App.scss';



class App extends Component {
  render() {
    return (
    
      <div className="App">
          <Home />
      </div>

    );
  }
}

export default App;
