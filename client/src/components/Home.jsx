import React, { Component } from 'react';
import Dropdown from 'react-dropdown';
// import Select from 'react-select';
import { PieChart, LineChart } from 'react-chartkick'
import 'chart.js'
import './Home.css';
import 'react-dropdown/style.css';
import * as Constants from '../constants'


class Home extends Component {
  constructor(props) {
    super(props);
    this.routeToRevenue = this.routeToRevenue.bind(this);
    this.routeToReach = this.routeToReach.bind(this);
  }

  routeToRevenue() {
    const path = "/revenue";
    this.props.history.push(path);
  }

  routeToReach() {
    const path = "/reach"
    this.props.history.push(path);
  }

  render() {
    return (
      <div className="home">
        <h1 className="home-title"> hello there! </h1>
        <h3 className="home-subtitle"> welcome to the ubongo data dashboard :) </h3>
        <div className="container">
          <div className="box">
            <button className="page-button" onClick={this.routeToRevenue}>revenue</button>
          </div>
          <div className="box">
            <button className="page-button" onClick={this.routeToReach}>reach</button>
          </div>
        </div>
      </div>    
    );
  }
}
export default Home;