import React, { Component } from 'react';
import Dropdown from 'react-dropdown';
import LoadingScreen from 'react-loading-screen';
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
      loading: true,
      ebooksDict: {},
      iOSDict: {},
      albumsDict: {},
      youtubeAkiliEnDict: {},
      youtubeAkiliSwDict: {},
      youtubeUbongoEnDict: {},
      youtubeUbongoSwDict: {},
      merchDict: {},
      pieStartMonth: 'December',
      pieStartYear: '2018',
      pieEndMonth: 'December',
      pieEndYear: '2018',
      growthStartMonth: 'January',
      growthStartYear: '2018',
      growthEndMonth: 'March',
      growthEndYear: '2019',
      revenuePieChart: {},
      revenueGrowthChart: {},
      revenuePieNumber: "",
    };
    this.updateDicts = this.updateDicts.bind(this);
    this.setRevenuePieChart = this.setRevenuePieChart.bind(this);
    this.setRevenueGrowthChart = this.setRevenueGrowthChart.bind(this);
    this.routeToHome = this.routeToHome.bind(this);
    this._onPieStartMonthSelect = this._onPieStartMonthSelect.bind(this);
    this._onPieStartYearSelect = this._onPieStartYearSelect.bind(this);
    this._onPieEndMonthSelect = this._onPieEndMonthSelect.bind(this);
    this._onPieEndYearSelect = this._onPieEndYearSelect.bind(this);
    this._onGrowthStartMonthSelect = this._onGrowthStartMonthSelect.bind(this);
    this._onGrowthStartYearSelect = this._onGrowthStartYearSelect.bind(this);
    this._onGrowthEndMonthSelect = this._onGrowthEndMonthSelect.bind(this);
    this._onGrowthEndYearSelect = this._onGrowthEndYearSelect.bind(this);
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
        this.setState({loading: false});
        callbacks.forEach((callback) => {
          callback();
        })
      }
    });
  }

  setRevenuePieChart() {
    let revenue = {};
    let revenueTotal = 0;
    let startDate = new Date(this.state.pieStartMonth + this.state.pieStartYear);
    let endDate = new Date(this.state.pieEndMonth + this.state.pieEndYear);

    Constants.DP_DICTS.forEach((dictName, i) => {
      let dpName = Constants.DP_ENDPOINTS[i];
      revenue[dpName] = 0;

      for (const [key, value] of Object.entries(this.state[dictName])) {
        let tempDate = new Date(key);
        if (tempDate >= startDate && tempDate <= endDate) {
          revenue[dpName] = revenue[dpName] + value;
          revenueTotal = revenueTotal + value;
          console.log(revenueTotal);
        }  
      }
    });

    this.setState({ 
      revenuePieChart: revenue,
      revenuePieNumber: revenueTotal,
    });
  }

  setRevenueGrowthChart() {
    let growthData = [];
    let startDate = new Date(this.state.growthStartMonth + this.state.growthStartYear);
    let endDate = new Date(this.state.growthEndMonth + this.state.growthEndYear);

    Constants.DP_DICTS.forEach((dictName, i) => {
      let dpData = JSON.parse(JSON.stringify(this.state[dictName]));

      for (const [key] of Object.entries(this.state[dictName])) {
        let tempDate = new Date(key);
        if (tempDate < startDate || tempDate > endDate) {
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

  _onGrowthStartMonthSelect(option) {
    this.setState({ growthStartMonth: option.value }, () => {
      this.setRevenueGrowthChart();
    });
  }

  _onGrowthStartYearSelect(option) {
    this.setState({ growthStartYear: option.value }, () => {
      this.setRevenueGrowthChart();
    });
  }

  _onGrowthEndMonthSelect(option) {
    this.setState({ growthEndMonth: option.value }, () => {
      this.setRevenueGrowthChart();
    });
  }

  _onGrowthEndYearSelect(option) {
    this.setState({ growthEndYear: option.value }, () => {
      this.setRevenueGrowthChart();
    });
  }

  _onPieStartMonthSelect(option) {
    this.setState({ pieStartMonth: option.value }, () => {
      this.setRevenuePieChart();
    });
  }

  _onPieStartYearSelect(option) {
    this.setState({ pieStartYear: option.value }, () => {
      this.setRevenuePieChart();
    });
  }

  _onPieEndMonthSelect(option) {
    this.setState({ pieEndMonth: option.value }, () => {
      this.setRevenuePieChart();
    });
  }

  _onPieEndYearSelect(option) {
    this.setState({ pieEndYear: option.value }, () => {
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
        <LoadingScreen
          loading={this.state.loading}
          bgColor='#f1f1f1'
          spinnerColor='#9ee5f8'
          textColor='#676767'
          text='loading your data'
        > 
          <h1 className="revenue-title"> revenue data for digital products team </h1>
          <div className="container">
            <div className="box">
              <h3 className="chart-title"> Revenue Growth by Digital Product </h3>
              <div className="chart">
                <LineChart data={this.state.revenueGrowthChart} xtitle="Month" ytitle="Revenue in USD"/>
              </div>
              <div className="dropdown-field">
                Start:
              </div>
              <div className="dropdown">
                <Dropdown
                  className="dropdown-color"
                  options={Constants.MONTHS}
                  onChange={this._onGrowthStartMonthSelect}
                  value={this.state.growthStartMonth}
                  placeholder="Select a month"
                />
              </div>
              <div className="dropdown">
                <Dropdown
                  className=""
                  options={Constants.YEARS}
                  onChange={this._onGrowthStartYearSelect}
                  value={this.state.growthStartYear}
                  placeholder="Select a year"
                />
              </div>
              <div className="dropdown-field">
                End:
              </div>
              <div className="dropdown">
                <Dropdown
                  className="dropdown-color"
                  options={Constants.MONTHS}
                  onChange={this._onGrowthEndMonthSelect}
                  value={this.state.growthEndMonth}
                  placeholder="Select a month"
                />
              </div>
              <div className="dropdown">
                <Dropdown
                  className=""
                  options={Constants.YEARS}
                  onChange={this._onGrowthEndYearSelect}
                  value={this.state.growthEndYear}
                  placeholder="Select a year"
                />
              </div>
            </div>

            <div className="box">
              <h3 className="chart-title"> Revenue from {this.state.pieStartMonth}, {this.state.pieStartYear} to {this.state.pieEndMonth}, {this.state.pieEndYear} </h3>
              <div className="chart pie-chart">
                <PieChart data={this.state.revenuePieChart} xtitle="Month" ytitle="Revenue in USD"/>
              </div>
              <div className="revenue-number">
                Total {"$" + Math.round(this.state.revenuePieNumber).toString(10)}
              </div>
              <div className="dropdown-field">
                Start:
              </div>
              <div className="dropdown">
                <Dropdown
                  className="dropdown-color"
                  options={Constants.MONTHS}
                  onChange={this._onPieStartMonthSelect}
                  value={this.state.pieStartMonth}
                  placeholder="Select a month"
                />
              </div>
              <div className="dropdown">
                <Dropdown
                  className=""
                  options={Constants.YEARS}
                  onChange={this._onPieStartYearSelect}
                  value={this.state.pieStartYear}
                  placeholder="Select a year"
                />
              </div>
              <div className="dropdown-field">
                End:
              </div>
              <div className="dropdown">
                <Dropdown
                  className="dropdown-color"
                  options={Constants.MONTHS}
                  onChange={this._onPieEndMonthSelect}
                  value={this.state.pieEndMonth}
                  placeholder="Select a month"
                />
              </div>
              <div className="dropdown">
                <Dropdown
                  className=""
                  options={Constants.YEARS}
                  onChange={this._onPieEndYearSelect}
                  value={this.state.pieEndYear}
                  placeholder="Select a year"
                />
              </div>
            </div>
          </div>
          <div>
            <button className="home-button" onClick={this.routeToHome}>home</button>
          </div>
        </LoadingScreen>
      </div>
    );
  }
}
export default Revenue;