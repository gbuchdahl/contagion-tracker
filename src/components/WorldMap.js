import React, { Component } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { Container } from "react-bulma-components";
import { scaleLinear } from "d3-scale";
import Slider from "./Slider";

// import '../data/countries.json'

let geoData = require("../data/countries.json");

// const geoUrl =
//   "https://raw.githubusercontent.com/zcreativelabs/react-simple-maps/master/topojson-maps/world-110m.json";

const epoch = new Date(2020, 2, 1); // Start visualization from March 1st

// number of days between march 1st and present
const NUM_DAYS = (Date.now() - epoch.getTime()) / (1000 * 3600 * 24);

// help us make color scheme
const MAX_DEATHS = 3;

// plug in a number, outputs a color
const colorScale = scaleLinear()
  .domain([0, MAX_DEATHS])
  .range(["#e5e5e5", "#ff5233"]);

// 3 digit country codes, taken from the thing that made the map
const codes = geoData["objects"]["ne_110m_admin_0_countries"]["geometries"].map(
  (country) => country["properties"]["ISO_A3"]
);

// QUERY API for DPM
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
      date: epoch,
      fills: gray,
    };

    this.fetchFills = this.fetchFills.bind(this);
    this.fetchFills(epoch);
  }

  updateVal = async (val) => {
    let newDate = new Date(2020, 2, val);
    this.setState({ date: newDate });
    this.fetchFills(this.state.date);
  };

  async fetchFills(date) {
    let res = await fetch(query_by_date(date)).then((response) =>
      response.json()
    );
    const DPM_docs = res.val;
    let fills = codes.map((code) => {
      let doc = DPM_docs.find((country) => country["country_code"] === code);
      let deaths = undefined;
      if (doc !== undefined) {
        deaths = doc.new_deaths_per_million;
      }
      if (deaths && deaths > MAX_DEATHS) {
        return "#FF0000";
      }
      return deaths === undefined ? "#e5e5e5" : colorScale(deaths);
    });
    this.setState({ fills });
  }

  render() {
    return (
      <Container>
        <h2 className="is-2 has-text-centered">
          {this.state.date.toDateString().slice(4)}
        </h2>
        <Slider num_days={NUM_DAYS} update={this.updateVal} />
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
