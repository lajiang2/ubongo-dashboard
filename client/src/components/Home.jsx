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
    this.state = {
      broadcastReachDict: '',
      ebooksDict: {},
      iOSDict: {},
      albumsDict: {},
      youtubeAkiliEnDict: {},
      youtubeAkiliSwDict: {},
      youtubeUbongoEnDict: {},
      youtubeUbongoSwDict: {},
      merchDict: {},
      selectedMonth: 'March',
      selectedYear: '2018',
      revenueDisplayData: {}
    };
    this._onYearSelect = this._onYearSelect.bind(this);
    this._onMonthSelect = this._onMonthSelect.bind(this);
    this.updateDicts = this.updateDicts.bind(this);
    this.setRevenueDisplayData = this.setRevenueDisplayData.bind(this);
  }

  componentDidMount() {
    this.updateBroadcastReach();
    this.updateDicts(this.setRevenueDisplayData);
  }

  async updateBroadcastReach() {
    const res = await fetch('/api/broadcast-reach');
    const resJson = res.json();
    resJson.then(result => {
      let i;
      for (i = 0; i < result.length; i++) { 
        if (typeof result[i][1] !== 'undefined') {
          result[i][1] = parseInt(result[i][1].replace(/,/g, ''), 10)
        }
      }
      this.setState({ broadcastReachDict: result });
    });
  }

  async updateDicts(callback) {
    Constants.DP_ENDPOINTS.forEach(async (revenueSource, i) => {
      let dictString = Constants.DP_DICTS[i];

      const res = await fetch('/api/revenue/' + revenueSource);
      const resJson = res.json();
      resJson.then(result => {
        let revenueSourceDict = {};
        let i;
        for (i = 0; i < result.length; i++) { 
          revenueSourceDict[result[i].month + result[i].year] = Math.round(result[i].revenue * 100) / 100;
        }
        this.setState({[dictString]: revenueSourceDict});
      });
      if (i === Constants.DP_ENDPOINTS.length - 1) {
        callback();
      }
    });
  }

  setRevenueDisplayData() {
    console.log("here");
    let revenue = {};
    let dateKey = this.state.selectedMonth + this.state.selectedYear;
    Constants.DP_ENDPOINTS.forEach(async (dp, i) => {
      let dictString = Constants.DP_DICTS[i];
      revenue[dp] = this.state[dictString][dateKey];
    });

    console.log("revenue", revenue);

    this.setState({ revenueDisplayData: revenue })
  }

  _onYearSelect(option) {
    this.setState({ selectedYear: option.value }, () => {
      this.setRevenueDisplayData();
    });
  }

  _onMonthSelect(option) {
    this.setState({ selectedMonth: option.value }, () => {
      this.setRevenueDisplayData();
    });
  }

  render() {
    return (
      <div className="home">
          <h1 className="home-title"> hello there! </h1>
          <h3 className="home-subtitle"> welcome to the ubongo data dashboard :) </h3>
          <div className="dropdown">
            <Dropdown
              className=""
              options={Constants.YEARS}
              onChange={this._onYearSelect}
              value={this.state.selectedYear}
              placeholder="Select a year"
            />
          </div>
          <div className="dropdown">
            <Dropdown
              className=""
              options={Constants.MONTHS}
              onChange={this._onMonthSelect}
              value={this.state.selectedMonth}
              placeholder="Select a month"
            />
          </div>
          <div className="container">
            <div className="box">
              <div className="title"> Broadcast Reach Tracker </div>
              <LineChart data={this.state.broadcastReachDict} xtitle="Month" ytitle="Reach (in millions)" colors={["#83D3CF", "red"]}/>
            </div>
            <div className="box">
              <div className="title"> Revenue </div>
              <PieChart data={this.state.revenueDisplayData} xtitle="Month" ytitle="Revenue (in dollars)"/>
            </div>
          </div>
        </div>
      
    );
  }
}
export default Home;