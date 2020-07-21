import React, { Component, useState } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { Container } from "react-bulma-components";



const geoUrl =
  "https://raw.githubusercontent.com/zcreativelabs/react-simple-maps/master/topojson-maps/world-110m.json";

const epoch = new Date(2020,0,1)

const num_days = (Date.now() - epoch.getTime())/(1000*3600*24)

class WorldMap extends Component {

  constructor(props) {
    super(props);
    this.state = {
      slider_val: 0,
      date: epoch
    }
    this.handleSlider = this.handleSlider.bind(this);

  }

  handleSlider = (e) => {
    let newDate = new Date(2020,0,e.target.value)
    this.setState({slider_val: e.target.value, date: newDate});
  }




  render() {
    return (
      <Container>
        <h2 className="is-2 has-text-centered">{this.state.date.toDateString()}</h2>
        <input className="slider is-fullwidth" step="1" min="0" max={num_days} value={this.state.slider_val} type="range" onChange={this.handleSlider}/>
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
