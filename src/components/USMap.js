import React, { Component } from "react";
import { geoCentroid } from "d3-geo";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  Annotation,
  ZoomableGroup,
} from "react-simple-maps";
import { Container } from "react-bulma-components";
import Slider from "./Slider";
import { scaleLinear } from "d3-scale";

import allStates from "../data/allStates.json";
import LinearGradient from "./LinearGradient.js";
import USModalCard from "./USModalCard";

// const geoUrl = "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json";

const geoData = require("../data/stateData.json");

let ids = geoData["objects"]["states"]["geometries"].map(
  (state) => state["id"]
);

// get a list of all the states by 2 letter code
const states = ids.map((id) => allStates.find((doc) => id === doc.val)["id"]);

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

const epoch = new Date(2020, 2, 15); // Start visualization from March 1st

// number of days between march 1st and present
const end = new Date(2020, 6, 20)
const NUM_DAYS = (end.getTime() - epoch.getTime()) / (1000 * 3600 * 24);

// help us make color scheme
const MAX_DEATHS = 15;

const MAX_CASES = 500;

const colorScaleDeaths = scaleLinear()
  .domain([0, MAX_DEATHS])
  .range(["#e5e5e5", "#ff5233"]);

const colorScaleCases = scaleLinear()
  .domain([0, MAX_CASES])
  .range(["#e5e5e5", "#ffa500"]);

// Gradient Parameters
const gradientDataDeaths = {
  title: "Deaths per Million",
  fromColor: "#e5e5e5",
  toColor: "#ff5233",
  min: 0,
  max: `${MAX_DEATHS}+`,
};

const gradientDataCases = {
  title: "Cases per Million",
  fromColor: "#e5e5e5",
  toColor: "#FFA500",
  min: 0,
  max: `${MAX_CASES}+`,
};



class USMap extends Component {
  constructor(props) {
    super(props);
    // initial fill is all gray
    const gray = Array(177).fill("#e5e5e5");

    this.state = {
      date: epoch,
      fills: gray,
      data: undefined,
      state: undefined,
      modal: false,
      stat: "cases"
    };

    this.fetchFills = this.fetchFills.bind(this);
    this.toggleModal = this.toggleModal.bind(this);
    this.generateData = this.generateData.bind(this);
    this.query_by_date = this.query_by_date.bind(this);
    this.toggleStat = this.toggleStat.bind(this);
    this.fetchFills(epoch);
  }

  query_by_date = (date) => {
    let querystring = undefined;
    if (this.state.stat === "deaths") {
      querystring = (
        "/us-dpm-by-date?date=" +
        date.getDate() +
        "_" +
        (date.getMonth() + 1) +
        "_" +
        (date.getYear() + 1900)
      );
    } else {
      querystring = (
        "/us-cpm-by-date?date=" +
        date.getDate() +
        "_" +
        (date.getMonth() + 1) +
        "_" +
        (date.getYear() + 1900)
      );
    }
    return querystring;
  };

  updateVal = async (val) => {
    let newDate = new Date(2020, 2, parseInt(val) + 15);
    this.setState({ date: newDate });
    await this.fetchFills(this.state.date);
  };

  async fetchFills(date) {
    let res = await fetch(this.query_by_date(date)).then((response) =>
      response.json()
    );
    const DPM_docs = res.val;
    let fills = states.map((state) => {
      let doc = DPM_docs.find((doc) => doc["state_code"] === state);

      if (this.state.stat === "deaths") {
        let deaths = undefined;
        if (doc !== undefined) {
          deaths = doc.new_deaths_per_million;
        }
        if (deaths && deaths > MAX_DEATHS) {
          return "#FF0000";
        }
        return deaths === undefined ? "#e5e5e5" : colorScaleDeaths(deaths);
      } else {
        let cases = undefined;
        if (doc !== undefined) {
          cases = doc.new_cases_per_million;
        }
        if (cases && cases > MAX_CASES) {
          return "#FFA500";
        }
        return cases === undefined ? "#e5e5e5" : colorScaleCases(cases); 
      }
 
    });
    this.setState({ fills });
  }

  toggleModal = async () => {
    let setting = !this.state.modal;
    await this.generateData(this.state.date, this.state.state);
    this.setState({ modal: setting });
  };

  toggleStat = async () => {
    if (this.state.stat === "cases"){
      this.setState({stat: "deaths"});
    } else {
      this.setState({stat: "cases"});
    }
    await this.fetchFills(this.state.date)
    this.forceUpdate()
  }

  buildQuery = (date, state) => {
    return (
      "/us/" +
      state +
      "?date=" +
      date.getDate() +
      "_" +
      (date.getMonth() + 1) +
      "_" +
      (date.getYear() + 1900)
    );
  };

  generateData = async (date, state) => {
    if (state === undefined) {
      return "";
    }
    let query = this.buildQuery(date, state);

    let newData = await fetch(query).then((response) => response.json());
    if (newData.error === "Document not found") {
      newData["state"] = state;
      newData["date"] = date;
    }
    this.setState({ data: newData });
  };

  render() {
    return (
      <div>
        <h2 className="is-size-3 has-text-weight-bold has-text-centered">
          {this.state.date.toDateString().slice(4)}
        </h2>
        <Slider num_days={NUM_DAYS} update={this.updateVal} />
        <div className="columns is-vcentered">
          <div className="column is-8">
            <LinearGradient data={(this.state.stat === "cases") ? gradientDataCases : gradientDataDeaths} />
          </div>
          <div className='column'>
            <div onClick={() => this.setState({stat: "cases"})} className={(this.state.stat === "cases") ? "is-warning button mx-2" : "button mx-2"}>
              <p>Cases</p>
            </div>
            <div onClick={() => this.setState({stat: "deaths"})} className={(this.state.stat === "deaths") ? "is-danger button" : "button"}>
              <p >Deaths</p>
            </div>
          </div>
        </div>
        <div
          className={this.state.modal === true ? "modal is-active" : "modal"}
        >
          <div onClick={this.toggleModal} className="modal-background"></div>
          <USModalCard
            handle={() => this.setState({ modal: false })}
            {...this.state.data}
          />
          <button
            onClick={this.toggleModal}
            className="modal-close is-large"
            aria-label="close"
          ></button>
        </div>

        <div className="card mb-5">
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
                        fill={this.state === states[index] ? "#ABCDEF" : this.state.fills[index]}
                        onMouseEnter={() =>
                          this.setState({ state: states[index] })
                        }
                        onMouseLeave={() => this.setState({ state: undefined })}
                        onClick={() => this.toggleModal()}
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
        </div>
      </div>
    );
  }
}

export default USMap;
