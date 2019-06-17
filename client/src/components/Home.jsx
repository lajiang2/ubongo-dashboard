import React, { Component } from 'react';
import Dropdown from 'react-dropdown';
import Select from 'react-select';
import { PieChart, LineChart } from 'react-chartkick'
import 'chart.js'
import './Home.css';
import 'react-dropdown/style.css';


class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      broadcastReachData: '',
      ebooksData: [],
      iOSData: [],
      albumsData: [],
      selectedYear: '',
      selectedMonth: ''
    };
    this._onYearSelect = this._onYearSelect.bind(this);
    this._onMonthSelect = this._onMonthSelect.bind(this);
  }

  componentDidMount() {
    this.updateBroadcastReach();
    this.updateEbooksData();
    this.updateiOSData();
    this.updateAlbumsData();
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
      this.setState({ broadcastReachData: result });
    });
  }

  async updateEbooksData() {
    const res = await fetch('/api/revenue/ebooks');
    const resJson = res.json();
    resJson.then(result => {
      // var ebooksArr = {};
      var ebooksArr = [];
      let i;
      for (i = 0; i < result.length; i++) { 
        // ebooksArr[result[i].month + result[i].year] = result[i].revenue;
        ebooksArr.push([result[i].month + result[i].year, result[i].revenue]);
      }
      this.setState({ ebooksData: ebooksArr });
    });
  }

  async updateiOSData() {
    const res = await fetch('/api/revenue/ios');
    const resJson = res.json();
    resJson.then(result => {
      // var ebooksArr = {};
      var iOSArr = [];
      let i;
      for (i = 0; i < result.length; i++) { 
        // ebooksArr[result[i].month + result[i].year] = result[i].revenue;
        iOSArr.push([result[i].month + result[i].year, result[i].revenue]);
      }
      this.setState({ iOSData: iOSArr });
    });
  }

  async updateAlbumsData() {
    const res = await fetch('/api/revenue/albums');
    const resJson = res.json();
    resJson.then(result => {
      // var ebooksArr = {};
      var albumsArr = [];
      let i;
      for (i = 0; i < result.length; i++) { 
        // ebooksArr[result[i].month + result[i].year] = result[i].revenue;
        albumsArr.push([result[i].month + result[i].year, result[i].revenue]);
      }
      this.setState({ albumsData: albumsArr });
    });
  }

  _onYearSelect(option) {
    this.setState({ selectedYear: option });
  }

  _onMonthSelect(option) {
    this.setState({ selectedMonth: option });
  }

  render() {
    const defaultYear = this.state.selectedYear;
    const defaultMonth = this.state.selectedMonth;
    const years = ["2018", "2019"];
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    return (
      <div className="home">
          <h1 className="home-title"> hello there! </h1>
          <h3 className="home-subtitle"> welcome to the ubongo data dashboard :) </h3>
          <div className="dropdown">
            <Dropdown
              className=""
              options={years}
              onChange={this._onYearSelect}
              value={defaultYear}
              placeholder="Select a year"
            />
          </div>
          <div className="dropdown">
            <Dropdown
              className=""
              options={months}
              onChange={this._onMonthSelect}
              value={defaultMonth}
              placeholder="Select a month"
            />
          </div>
          <div className="container">
            <div className="box">
              <div className="title"> Broadcast Reach Tracker </div>
              <LineChart data={this.state.broadcastReachData} xtitle="Month" ytitle="Reach (in millions)" colors={["#83D3CF", "red"]}/>
            </div>
            <div className="box">
              <div className="title"> ebooks Revenue </div>
              <PieChart data={this.state.ebooksData} xtitle="Month" ytitle="Revenue (in dollars)"/>
            </div>
          </div>
        </div>
      
    );
  }
  // render() {
  //   return (
  //     <LineChart data={this.state.broadcastReachData} xtitle="Month" ytitle="Reach (in millions)" />
  //   );
  // }
}
export default Home;