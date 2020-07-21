import React, { Component } from "react";
import { Columns, Button } from "react-bulma-components";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { Container } from "react-bulma-components";

const geoUrl =
  "https://raw.githubusercontent.com/zcreativelabs/react-simple-maps/master/topojson-maps/world-110m.json";

const epoch = new Date(2020, 0, 1);

const num_days = (Date.now() - epoch.getTime()) / (1000 * 3600 * 24);

// make the slider not move instantly
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

class WorldMap extends Component {
  constructor(props) {
    super(props);
    this.state = {
      slider_val: 0,
      date: epoch,
      playing: false,
    };
    this.handleSlider = this.handleSlider.bind(this);
    this.handlePlay = this.handlePlay.bind(this);
  }

  // function to update the date by moving the slider
  handleSlider = (e) => {
    this.setState({ playing: false });
    let newDate = new Date(2020, 0, e.target.value);
    this.setState({ slider_val: e.target.value, date: newDate });
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
        let new_date = new Date(2020, 0, new_val);
        this.setState({ slider_val: new_val, date: new_date });

        // check to see if it should keep playing after it wakes up
        await sleep(200);
        if (!this.state.playing){
          break;
        }
      }
    } else {
      // pause slider 
      this.setState({ playing: false });
    }
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
