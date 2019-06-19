import React, { Component } from 'react';
import Dropdown from 'react-dropdown';
// import Select from 'react-select';
import { PieChart, LineChart } from 'react-chartkick'
import 'chart.js'
import './Home.css';
import './Revenue.css';
import 'react-dropdown/style.css';
import * as Constants from '../constants'


class Revenue extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ebooksDict: {},
      iOSDict: {},
      albumsDict: {},
      youtubeAkiliEnDict: {},
      youtubeAkiliSwDict: {},
      youtubeUbongoEnDict: {},
      youtubeUbongoSwDict: {},
      merchDict: {},
      selectedMonth: 'December',
      selectedYear: '2018',
      revenuePieChart: {},
      revenueGrowthChart: {}
    };
    this._onYearSelect = this._onYearSelect.bind(this);
    this._onMonthSelect = this._onMonthSelect.bind(this);
    this.updateDicts = this.updateDicts.bind(this);
    this.setRevenuePieChart = this.setRevenuePieChart.bind(this);
    this.setRevenueGrowthChart = this.setRevenueGrowthChart.bind(this);
    this.routeToHome = this.routeToHome.bind(this);
  }

  componentDidMount() {
    this.updateDicts([this.setRevenuePieChart, this.setRevenueGrowthChart]);
  }

  async updateDicts(callbacks) {
    Constants.DP_ENDPOINTS.forEach(async (revenueSource, i) => {
      let dictString = Constants.DP_DICTS[i];

      const res = await fetch('/api/revenue/' + revenueSource);
      const resJson = res.json();
      resJson.then(result => {
        let revenueSourceDict = {};
        let i;
        for (i = 0; i < result.length; i++) { 
          revenueSourceDict[result[i].month + '-' + result[i].year] = Math.round(result[i].revenue * 100) / 100;
        }
        this.setState({[dictString]: revenueSourceDict});
      });
      if (i === Constants.DP_ENDPOINTS.length - 1) {
        callbacks.forEach((callback) => {
          callback();
        })
      }
    });
  }

setRevenuePieChart() {
  let revenue = {};
  let dateKey = this.state.selectedMonth + '-' + this.state.selectedYear;
  Constants.DP_ENDPOINTS.forEach((dp, i) => {
    let dictString = Constants.DP_DICTS[i];
    revenue[dp] = this.state[dictString][dateKey];
  });

  this.setState({ revenuePieChart: revenue })
}

setRevenueGrowthChart() {
  let growthData = [];

  Constants.DP_DICTS.forEach((dictName, i) => {
    let dpData = JSON.parse(JSON.stringify(this.state[dictName]));
    for (const [key] of Object.entries(this.state[dictName])) {
      if (key.includes("2015") || key.includes("2016") || key.includes("2017")) {
        delete dpData[key];
      }  
    }

    let dpDict = {};
    dpDict['name'] = Constants.DP_ENDPOINTS[i];
    dpDict['data'] = dpData;

    growthData.push(dpDict);
  });

  this.setState({ revenueGrowthChart: growthData })
}

  _onYearSelect(option) {
    this.setState({ selectedYear: option.value }, () => {
      this.setRevenuePieChart();
    });
  }

  _onMonthSelect(option) {
    this.setState({ selectedMonth: option.value }, () => {
      this.setRevenuePieChart();
    });
  }

  routeToHome() {
    const path = "/"
    this.props.history.push(path);
  }

  render() {
    return (
      <div className="home">
        <h1 className="revenue-title"> revenue data for digital products team </h1>
        <div className="container">
          <div className="box">
            <h3 className="chart-title"> Revenue by Digital Product </h3>
            <LineChart data={this.state.revenueGrowthChart} xtitle="Month" ytitle="Revenue in USD"/>
          </div>
          <div className="box">
            <h3 className="chart-title"> Revenue for {this.state.selectedMonth}, {this.state.selectedYear} </h3>
            <div className="pie-chart">
              <PieChart data={this.state.revenuePieChart} xtitle="Month" ytitle="Revenue in USD"/>
            </div>
            
            <div className="dropdown">
              <Dropdown
                className="dropdown-color"
                options={Constants.MONTHS}
                onChange={this._onMonthSelect}
                value={this.state.selectedMonth}
                placeholder="Select a month"
              />
            </div>
            <div className="dropdown">
              <Dropdown
                className=""
                options={Constants.YEARS}
                onChange={this._onYearSelect}
                value={this.state.selectedYear}
                placeholder="Select a year"
              />
            </div>
          </div>
        </div>
        <div>
          <button className="home-button" onClick={this.routeToHome}>home</button>
        </div>
      </div>
    );
  }
}
export default Revenue;