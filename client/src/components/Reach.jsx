import React, { Component } from 'react';
import Dropdown from 'react-dropdown';
import LoadingScreen from 'react-loading-screen';
import { PieChart, LineChart } from 'react-chartkick'
import 'chart.js'
import './Home.css';
import './Revenue.css';
import 'react-dropdown/style.css';
import * as Constants from '../constants'


class Reach extends Component {
  constructor(props) {
    super(props);
    this.routeToHome = this.routeToHome.bind(this);
  }

  routeToHome() {
    const path = "/"
    this.props.history.push(path);
  }

  render() {
    return (
      <div className="home">
        <h1 className="revenue-title"> reach data </h1>
        <h3 className="revenue-subtitle"> still working on this :( </h3>
        <button className="home-button" onClick={this.routeToHome}>home</button>
      </div>
    );
  }
}
export default Reach;