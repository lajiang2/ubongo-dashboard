import React, { Component } from 'react';
import Dropdown from 'react-dropdown';
import LoadingScreen from 'react-loading-screen';
import { PieChart, LineChart } from 'react-chartkick';
import 'chart.js'
import './Home.css';
import './Revenue.css';
import './Reach.css';
import 'react-dropdown/style.css';
import * as CONSTANTS from '../constants'
import * as API_KEYS from '../.apiKeys'

class Reach extends Component {
  constructor(props) {
    super(props);
    this.state = {
      broadcastReachData: {},
      broadcastMin: {},
      broadcastMax: {},
      akiliEnSubs: "",
      akiliSwSubs: "",
      ubongoEnSubs: "",
      ubongoSwSubs: "",
    };
    this.routeToHome = this.routeToHome.bind(this);
    this.updateYouTubePressed = this.updateYouTubePressed.bind(this)
    this.updateYouTubeSubs = this.updateYouTubeSubs.bind(this);
  }

  componentDidMount() {
    this.updateBroadcastReach();
    this.updateYouTubeSubs();
  }

  async updateBroadcastReach() {
    const res = await fetch('/api/broadcast-reach');
    const resJson = res.json();
    resJson.then(result => {
      let broadcastReach = {};
      let viewers;
      let broadcastMin = Number.MAX_SAFE_INTEGER;
      let broadcastMax = 0;
      let i;
      for (i = 0; i < result.length; i++) { 
        if (typeof result[i][1] !== 'undefined') {
          viewers = parseInt(result[i][1].replace(/,/g, ''), 10);
          if (viewers < broadcastMin) {
            broadcastMin = viewers;
          }

          if (viewers > broadcastMax) {
            broadcastMax = viewers;
          }
          broadcastReach[result[i][0]] = viewers;
        }
      }
      this.setState({ 
        broadcastReachData: broadcastReach,
        broadcastMin: broadcastMin,
        broadcastMax: broadcastMax,
      });
    });
  }

  updateYouTubeSubs() {
    CONSTANTS.CHANNELS.forEach(async (channelName) => {
      let stateVar = channelName + 'Subs';
      const res = await fetch('https://www.googleapis.com/youtube/v3/channels?part=statistics&id=' + CONSTANTS.CHANNEL_IDS[channelName] + '&key=' + API_KEYS.YOUTUBE);
      const resJson = res.json();
      resJson.then(result => {
        this.setState({ [stateVar]: result.items[0].statistics.subscriberCount });
      });
    });
  }

  updateYouTubePressed() {
    this.setState({
      akiliEnSubs: "",
      akiliSwSubs: "",
      ubongoEnSubs: "",
      ubongoSwSubs: "",
    }, () => {
      this.updateYouTubeSubs();
    })
  }

  routeToHome() {
    const path = "/"
    this.props.history.push(path);
  }

  render() {
    const info = (CONSTANTS.CHANNELS).map((channelName) => (
      <div className="sub-count">
        { channelName.slice(0, 1).toUpperCase() + channelName.slice(1, -2) + ' ' + channelName.slice(-2) + ': ' + this.state[channelName + 'Subs']}
      </div>
    ))

    return (
      <div className="home">
        <LoadingScreen
          loading={this.state.loading}
          bgColor='#f1f1f1'
          spinnerColor='#9ee5f8'
          textColor='#676767'
          text='loading your data'
        > 
          <h1 className="revenue-title"> reach data </h1>
          <div className="container">
            <div className="box">
              <h3 className="chart-title"> Broadcast Reach Target </h3>
              <div className="chart">
                <LineChart data={this.state.broadcastReachData} xtitle="Month" ytitle="Viewers" min={Math.round(this.state.broadcastMin * 0.8 / 1000000) * 1000000} max={Math.round(this.state.broadcastMax * 1.2 / 1000000) * 1000000}/>
              </div>
            </div>
            <div className="box">
              <h3 className="chart-title"> YouTube Subscribers </h3>
              <div className="youtube-subs">
                {info}
              </div>
              <button className="update-button" onClick={this.updateYouTubeSubs}>update</button>
            </div>
          </div>
          <button className="home-button" onClick={this.routeToHome}>home</button>
        </LoadingScreen>
      </div>
    );
  }
}
export default Reach;