import React, { Component } from "react";
import { Columns, Button } from "react-bulma-components";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { Container } from "react-bulma-components";
import { scaleLinear } from "d3-scale";

// import '../data/countries.json'

let geoData = require("../data/countries.json");

const geoUrl =
  "https://raw.githubusercontent.com/zcreativelabs/react-simple-maps/master/topojson-maps/world-110m.json";

const epoch = new Date(2020, 2, 1); // Start visualization from March 1st

// number of days between march 1st and present
const num_days = (Date.now() - epoch.getTime()) / (1000 * 3600 * 24);

// help us make color scheme
const MAX_DEATHS = 10;

// plug in a number, outputs a color
const colorScale = scaleLinear()
  .domain([0, MAX_DEATHS])
  .range(["#e5e5e5", "#ff5233"]);

// 3 digit country codes, taken from the thing that made the map
const codes = geoData["objects"]["ne_110m_admin_0_countries"]["geometries"].map(
  (country) => country["properties"]["ISO_A3"]
);

// make the slider not move instantly
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// function to help communicate with api
const build_query_string = (code, date) => {
  return (
    "/world/" +
    code +
    "?date=" +
    date.getDate() +
    "_" +
    (date.getMonth() + 1) +
    "_" +
    (date.getYear() + 1900)
  );
};

const query_by_date = (date) => {
  return (
    "/world-dpm-by-date?date=" +
    date.getDate() +
    "_" +
    (date.getMonth() + 1) +
    "_" +
    (date.getYear() + 1900)
  );
};

class WorldMap extends Component {
  constructor(props) {
    super(props);
    // initial fill is all gray
    const gray = Array(177).fill("#e5e5e5");

    this.state = {
      slider_val: 0,
      date: epoch,
      playing: false,
      fills: gray,
    };

    this.handleSlider = this.handleSlider.bind(this);
    this.handlePlay = this.handlePlay.bind(this);
    this.fetchFills = this.fetchFills.bind(this);
    this.fetchFills(epoch);
  }

  // function to update the date by moving the slider
  handleSlider = async (e) => {
    this.setState({ playing: false });
    let newDate = new Date(2020, 2, e.target.value);
    this.setState({ slider_val: e.target.value, date: newDate });
    let promises = await this.fetchFills(this.state.date);
  };

  // handles the play button
  async handlePlay() {
    let playing = this.state.playing;
    // if it was paused before
    if (!playing) {
      this.setState({ playing: true });
      let start = parseInt(this.state.slider_val);

      // iterate until you get to present day
      for (let i = 1; i < num_days - start; i++) {
        let new_val = start + i;
        let new_date = new Date(2020, 2, new_val);
        this.setState({ slider_val: new_val, date: new_date });

        this.fetchFills(new_date);

        // check to see if it should keep playing after it wakes up
        await sleep(200);
        if (!this.state.playing) {
          break;
        }
      }
    } else {
      // pause slider
      this.setState({ playing: false });
    }
  }

  async fetchFills(date) {
    let res = await fetch(query_by_date(date)).then(response => response.json());
    const DPM_docs = res.val;
    let fills = codes.map((code) => {
      let doc = DPM_docs.find((country) => country["country_code"] === code);
      let deaths = null;
      if (doc !== undefined) {
        deaths = doc.new_deaths_per_million;
      }
      if (deaths && deaths > MAX_DEATHS) {
        return "#FF0000";
      }
      return deaths === null ? "#e5e5e5" : colorScale(deaths);
    }
    )
    this.setState({fills});
  }

  render() {
    return (
      <Container>
        <h2 className="is-2 has-text-centered">
          {this.state.date.toDateString().slice(4)}
        </h2>
        <Columns className="is-vcentered">
          <Columns.Column className="is-four-fifths">
            <input
              className="slider is-danger is-fullwidth"
              step="1"
              min="0"
              max={num_days}
              value={this.state.slider_val}
              type="range"
              onChange={this.handleSlider}
            />
          </Columns.Column>
          <Columns.Column>
            <Button onClick={this.handlePlay} className="is-danger">
              <p>{this.state.playing ? "Pause" : "Play"}</p>
            </Button>
          </Columns.Column>
        </Columns>

        <ComposableMap>
          <Geographies geography={geoData}>
            {({ geographies }) =>
              geographies.map((geo, index) => {
                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill={this.state.fills[index]}
                  />
                );
              })
            }
          </Geographies>
        </ComposableMap>
      </Container>
    );
  }
}

export default WorldMap;
