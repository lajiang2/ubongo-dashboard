import React, { Component } from 'react';
import Dropdown from 'react-dropdown';
import Select from 'react-select';
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
      // selectedMonth: Constants.MONTHS[new Date().getMonth() + 1],
      // selectedYear: new Date().getFullYear().toString(),
      selectedMonth: 'March',
      selectedYear: '2018',
      revenueDisplayData: {}
    };
    this._onYearSelect = this._onYearSelect.bind(this);
    this._onMonthSelect = this._onMonthSelect.bind(this);
    this.updateDicts = this.updateDicts.bind(this);
  }

  componentDidMount() {
    this.updateBroadcastReach();
    // this.updateEbooksDict();
    // this.updateiOSDict();
    // this.updateAlbumsDict();
    this.updateDicts(['ebooks', 'iOS', 'albums'])
    // this.setRevenueDisplayData();
  }

  async updateDicts(revenueSources) {
    // console.log(revenueSources);
    let revenueDisplayData = {};
    let dateKey = this.state.selectedMonth + this.state.selectedYear;

    revenueSources.forEach(async (revenueSource) => {
      let dictString = revenueSource + 'Dict';

      const res = await fetch('/api/revenue/' + revenueSource);
      const resJson = res.json();
      resJson.then(result => {
        let revenueSourceDict = {};
        let i;
        for (i = 0; i < result.length; i++) { 
          revenueSourceDict[result[i].month + result[i].year] = result[i].revenue;
          if (dateKey === result[i].month + result[i].year) {
            revenueDisplayData[revenueSource] = result[i].revenue;
          }
        }

        this.setState({[dictString]: revenueSourceDict});

      });
    });

    this.setState({revenueDisplayData: revenueDisplayData});
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

  setRevenueDisplayData() {
    let revenue = {};
    let dateKey = this.state.selectedYear + this.state.selectedMonth
    revenue["ebooks"] = this.state.ebooksDict[dateKey];
    revenue["albums"] = this.state.albumsDict[dateKey];
    revenue["ebooks"] = this.state.ebooksDict[dateKey];
  }

  _onYearSelect(option) {
    this.setState({ selectedYear: option });
  }

  _onMonthSelect(option) {
    this.setState({ selectedMonth: option });
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
  // render() {
  //   return (
  //     <LineChart data={this.state.broadcastReachDict} xtitle="Month" ytitle="Reach (in millions)" />
  //   );
  // }
}
export default Home;