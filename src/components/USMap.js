import React, { Component } from "react";
import { geoCentroid } from "d3-geo";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  Annotation,
  ZoomableGroup
} from "react-simple-maps";
import { Container } from "react-bulma-components";
import Slider from "./Slider";
import { scaleLinear } from "d3-scale";

import allStates from "../data/allStates.json";
import LinearGradient from './LinearGradient.js';

const geoUrl = "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json";

const geoData = require('../data/stateData.json')

let ids = geoData["objects"]["states"]["geometries"].map(
  (state) => state["id"]
);

// get a list of all the states by 2 letter code
const states = ids.map(id => allStates.find((doc) => (id == doc.val))["id"])

const offsets = {
  VT: [50, -8],
  NH: [34, 2],
  MA: [30, -1],
  RI: [28, 2],
  CT: [35, 10],
  NJ: [34, 1],
  DE: [33, 0],
  MD: [47, 10],
  DC: [49, 21],
};

const epoch = new Date(2020, 2, 1); // Start visualization from March 1st

// number of days between march 1st and present
const NUM_DAYS = (Date.now() - epoch.getTime()) / (1000 * 3600 * 24);

// help us make color scheme
const MAX_DEATHS = 15;

const colorScale = scaleLinear()
  .domain([0, MAX_DEATHS])
  .range(["#e5e5e5", "#ff5233"]);

// Gradient Parameters
const gradientData = {
  title: "Deaths per Million",
  fromColor: "#e5e5e5",
  toColor: "#ff5233",
  min: 0,
  max: `${MAX_DEATHS}+`
};

// QUERY API for DPM
const query_by_date = (date) => {
  return (
    "/us-dpm-by-date?date=" +
    date.getDate() +
    "_" +
    (date.getMonth() + 1) +
    "_" +
    (date.getYear() + 1900)
  );
};

class USMap extends Component {
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
    await this.fetchFills(this.state.date);
  };

  async fetchFills(date) {
    let res = await fetch(query_by_date(date)).then((response) =>
      response.json()
    );
    const DPM_docs = res.val;
    console.log(DPM_docs)
    let fills = states.map((state) => {
      let doc = DPM_docs.find((doc) => doc["state_code"] === state);
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
        <ComposableMap projection="geoAlbersUsa">
          <ZoomableGroup zoom={1}>
            <Geographies geography={geoData}>
              {({ geographies }) => (
                <>
                  {geographies.map((geo, index) => (
                    <Geography
                      key={geo.rsmKey}
                      stroke="#FFF"
                      geography={geo}
                      fill={this.state.fills[index]}
                    />
                  ))}
                  {geographies.map((geo) => {
                    const centroid = geoCentroid(geo);
                    const cur = allStates.find((s) => s.val === geo.id);
                    return (
                      <g key={geo.rsmKey + "-name"}>
                        {cur &&
                          centroid[0] > -160 &&
                          centroid[0] < -67 &&
                          (Object.keys(offsets).indexOf(cur.id) === -1 ? (
                            <Marker coordinates={centroid}>
                              <text y="2" fontSize={14} textAnchor="middle">
                                {cur.id}
                              </text>
                            </Marker>
                          ) : (
                            <Annotation
                              subject={centroid}
                              dx={offsets[cur.id][0]}
                              dy={offsets[cur.id][1]}
                            >
                              <text
                                x={4}
                                fontSize={14}
                                alignmentBaseline="middle"
                              >
                                {cur.id}
                              </text>
                            </Annotation>
                          ))}
                      </g>
                    );
                  })}
                </>
              )}
            </Geographies>
          </ZoomableGroup>
        </ComposableMap>
        <LinearGradient data={gradientData}></LinearGradient>
      </Container>
    );
  }
}

export default USMap;
