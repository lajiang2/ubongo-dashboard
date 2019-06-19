import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import './App.css';

import Home from './components/Home';
import Reach from './components/Reach';
import Revenue from './components/Revenue';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Switch>
          <Route exact path='/' component={Home} />
          <Route path='/revenue' component={Revenue} />
          <Route path='/reach' component={Reach} />
        </Switch>
      </div>
    );
  }
}

export default App;