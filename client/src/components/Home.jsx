import React, { Component } from 'react';
import { LineChart } from 'react-chartkick'
import 'chart.js'
import './Home.css';

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      broadcastReachData: '',
      ebookData: {},
    };
  }

  componentDidMount() {
    this.updateBroadcastReach();
    this.updateEbookData();
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

  async updateEbookData() {
    const res = await fetch('/api/ebook');
    const resJson = res.json();
    resJson.then(result => {
      // let i;
      // for (i = 0; i < result.length; i++) { 
      //   if (typeof result[i][1] !== 'undefined') {
      //     result[i][1] = parseInt(result[i][1].replace(/,/g, ''), 10)
      //   }
      // }
      this.setState({ ebookData: result });
    });
  }

  render() {
    return (
      <div className="home">
        
          <h1 className="home-title"> hello there! </h1>
          <h3 className="home-subtitle"> welcome to the ubongo data dashboard :) </h3>
          <div className="container">
            <div className="box">
              <div className="title"> Broadcast Reach Tracker </div>
              <LineChart data={this.state.broadcastReachData} xtitle="Month" ytitle="Reach (in millions)" colors={["#83D3CF", "red"]}/>
            </div>
            <div className="box">
              <div className="title"> Ebook Revenue </div>
              <LineChart data={this.state.ebookData} xtitle="Month" ytitle="Revenue (in dollars)" colors={["#83D3CF", "red"]}/>
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