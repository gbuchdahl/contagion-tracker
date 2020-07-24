import React, { Component } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
} from "react-simple-maps";
import { Container } from "react-bulma-components";
import { scaleLinear } from "d3-scale";
import Slider from "./Slider";

import LinearGradient from "./LinearGradient.js";
import CountryModalCard from "./CountryModalCard";
import ReactWordcloud from 'react-wordcloud';
import {cloneDeep} from "lodash"


// import '../data/countries.json'

let geoData = require("../data/countries.json");

// const geoUrl =
//   "https://raw.githubusercontent.com/zcreativelabs/react-simple-maps/master/topojson-maps/world-110m.json";

const epoch = new Date(2020, 2, 1); // Start visualization from March 1st

// number of days between march 1st and present
const end = new Date(2020, 6, 20)
const NUM_DAYS = (end.getTime() - epoch.getTime()) / (1000 * 3600 * 24);

const MAX_DEATHS = 5;

const MAX_CASES = 100;

// MAX_SIZE for Twitter Data
const MAX_SIZE = 100;

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


const options = {
  fontFamily: "sans-serif",
  rotations: 0,
  rotationAngles: [0, 0.0001 ]
}

const callbacks = {
  getWordColor: (word) => {
      return word["text"].match(/(covid|corona|lockdown|pandemic|socialdist|virus)/g) ? "#FF0000" : "#000000";
    },
  onWordClick: (word) => {
    const url = `https://twitter.com/search?lang=en&q=(%23${word["text"].substr(1)})&src=typed_query`;
    window.open(url, '_blank');
  }
}

// 3 digit country codes, taken from the thing that made the map
const codes = geoData["objects"]["ne_110m_admin_0_countries"]["geometries"].map(
  (country) => country["properties"]["ISO_A3"]
);


class WorldMap extends Component {
  constructor(props) {
    super(props);
    // initial fill is all gray
    const gray = Array(177).fill("#e5e5e5");

    this.state = {
      date: epoch,
      fills: gray,
      index: undefined,
      modal: false,
      data: undefined,
      twitter: [],
      stat: "cases",
      window: 1,
    };

    this.fetchFills = this.fetchFills.bind(this);
    this.toggleModal = this.toggleModal.bind(this);
    this.setIndex = this.setIndex.bind(this);
    this.generateData = this.generateData.bind(this);
    this.buildQuery = this.buildQuery.bind(this);
    this.query_by_date = this.query_by_date.bind(this);
    this.fetchFills(epoch);
  }

  updateVal = async (val) => {
    let newDate = new Date(2020, 2, val);
    this.setState({ date: newDate });
    await this.fetchFills(this.state.date);
    this.forceUpdate();
  };

  async fetchFills(date) {
    let res = await fetch(this.query_by_date(date)).then((response) =>
      response.json()
    );
    const DPM_docs = res.val;
    let fills = codes.map((code) => {
      let doc = DPM_docs.find((country) => country["country_code"] === code);
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

  toggleModal = async() => {
    let setting = !this.state.modal;
    await this.generateData(this.state.date, codes[this.state.index]);
    // this.setState({twitter: twitterData});
    this.setState({ modal: setting });
  };

  setIndex = (ind) => {
    this.setState({ index: ind });
  };

  buildQuery = (date, code) => {
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

  query_by_date = (date) => {
    let querystring = undefined;
    if (this.state.stat === "deaths") {
        querystring = (
          "/world-dpm-avg-by-date?date=" +
          date.getDate() +
          "_" +
          (date.getMonth() + 1) +
          "_" +
          (date.getYear() + 1900) + 
          "&window=" + this.state.window
        );

    } else {
      querystring = (
        "/world-cpm-avg-by-date?date=" +
        date.getDate() +
        "_" +
        (date.getMonth() + 1) +
        "_" +
        (date.getYear() + 1900) + 
        "&window=" + this.state.window
      );
    }
    return querystring;
  };

  // TODO
  buildTwitterQuery = (date, code, maxSize) => {
    return (
      "/world-hashtag-popularity/" +
      code +
      "?date=" +
      date.getDate() +
      "_" +
      (date.getMonth() + 1) +
      "_" +
      (date.getYear() + 1900) + 
      "&maxSize=" +
      maxSize
    );
  };

  generateData = async (date, code) => {
    if (code === undefined) {
      return "";
    }
    let query = this.buildQuery(date, code);

    let newData = await fetch(query).then((response) => response.json());
    if (newData.error === "Document not found") {
      newData["code"] = code;
      newData["date"] = date;
    }
    this.setState({ data: newData });

    let twitterQuery = this.buildTwitterQuery(date, code, MAX_SIZE);

    let twitterData = await fetch(twitterQuery).then((response) => response.json());
    if (twitterData.error === "Document not found") {
      twitterData["code"] = code;
      twitterData["date"] = date;
      twitterData["val"] = [];
    }
    let words = [];
    if (!twitterData["val"]) {
      twitterData["val"] = []
    }
    words = twitterData["val"].map((doc) => {
      let new_doc = {
        "text": doc.hashtag,
        "value": parseInt(doc.popularity),
      };
      if (new_doc.hashtag === undefined) {
        doc.hashtag = "";
      }
      return new_doc;
    });

    this.setState({ twitter: words });
  };

  handleUSA = () => {
    this.setState({ modal: false });
    this.props.switch();
  };

  render() {
    return (
      <Container>
        <h1 className="is-size-3 has-text-weight-bold has-text-centered">
          {this.state.date.toDateString().slice(4)}
        </h1>
        <Slider num_days={NUM_DAYS} update={this.updateVal} />

        <div
          className={this.state.modal === true ? "modal is-active" : "modal"}
        >
          <div onClick={this.toggleModal} className="modal-background"></div>
          <CountryModalCard
            handleUSA={this.handleUSA}
            handle={() => this.setState({ modal: false })}
            {...this.state.twitter}
            {...this.state.data}
          >
          {this.state.twitter !== [] && 
          <div style={{ backgroundColor: '#efefef', height: '300px', width: '100%' }}>
            <ReactWordcloud options={options} words={this.state.twitter} callbacks={callbacks}></ReactWordcloud>
          </div>}
          </CountryModalCard>
          <button
            onClick={this.toggleModal}
            className="modal-close is-large"
            aria-label="close"
          ></button>
        </div>
        <div className="columns is-vcentered">
          <div className="column is-5 has-text-centered">
            <LinearGradient data={(this.state.stat === "cases") ? gradientDataCases : gradientDataDeaths} />
          </div>
          <div className='column has-text-centered'>
            <div onClick={() => this.setState({stat: "cases"})} className={(this.state.stat === "cases") ? "is-warning button mx-1" : "button mx-1"}>
              <p>Cases</p>
            </div>
            <div onClick={() => this.setState({stat: "deaths"})} className={(this.state.stat === "deaths") ? "is-danger button ml-1 mr-5" : "button ml-1 mr-5"}>
              <p >Deaths</p>
            </div>
            <div onClick={() => this.setState({window: 1})} className={(this.state.window === 1) ? "is-success button ml-5 mr-1" : "button ml-5 mr-1"}>
              <p >Daily</p>
            </div>
            <div onClick={() => this.setState({window: 3})} className={(this.state.window === 3) ? "is-success button mx-1" : "button mx-1"}>
              <p >3-day avg</p>
            </div>
            <div onClick={() => this.setState({window: 7})} className={(this.state.window === 7) ? "is-success button mx-1" : "button mx-1"}>
              <p >7-day avg</p>
            </div>
          </div>
        </div>
        <div className="card mb-5">
          <ComposableMap>
            <ZoomableGroup zoom={1}>
              <Geographies geography={geoData}>
                {({ geographies }) =>
                  geographies.map((geo, index) => {
                    return (
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        fill={this.state.index === index ? "#ABCDEF" : this.state.fills[index]}
                        stroke="#FFF"
                        onMouseEnter={() => this.setIndex(index)}
                        onMouseLeave={() => this.setIndex(undefined)}
                        onClick={() => this.toggleModal()}
                      />
                    );
                  })
                }
              </Geographies>
            </ZoomableGroup>
          </ComposableMap>
        </div>
      </Container>
    );
  }
}

export default WorldMap;
