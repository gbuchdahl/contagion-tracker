import React, { Component } from "react";
import { Columns, Button } from "react-bulma-components";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { Container } from "react-bulma-components";

const geoUrl =
  "https://raw.githubusercontent.com/zcreativelabs/react-simple-maps/master/topojson-maps/world-110m.json";

const epoch = new Date(2020, 0, 1);

const num_days = (Date.now() - epoch.getTime()) / (1000 * 3600 * 24);

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

class WorldMap extends Component {
  constructor(props) {
    super(props);
    this.state = {
      slider_val: 0,
      date: epoch,
    };
    this.handleSlider = this.handleSlider.bind(this);
    this.handlePlay = this.handlePlay.bind(this);
  }

  handleSlider = (e) => {
    let newDate = new Date(2020, 0, e.target.value);
    this.setState({ slider_val: e.target.value, date: newDate });
  };

  handlePlay = (e) => {
    console.log("BOOM")
    // while (this.state.slider_val < num_days) {
    let new_val = parseInt(this.state.slider_val) + 1;
    let new_date = new Date(2020, 0, new_val);
    this.setState({ slider_val: new_val, date: new_date });
    sleep(50);
    // }
  };

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
              <p>Play</p>
            </Button>
          </Columns.Column>
        </Columns>

        <ComposableMap>
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map((geo) => (
                <Geography key={geo.rsmKey} geography={geo} />
              ))
            }
          </Geographies>
        </ComposableMap>
      </Container>
    );
  }
}

export default WorldMap;
