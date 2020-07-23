import React, { Component } from "react";
import { Columns, Button } from "react-bulma-components";

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

class Slider extends Component {
  constructor(props) {
    super(props);

    this.state = {
      playing: false,
      val: 0,
    };

    this.handleSlider = this.handleSlider.bind(this);
    this.handlePlay = this.handlePlay.bind(this);
  }

  handleSlider = async (e) => {
    this.setState({ playing: false });
    this.props.update(e.target.value);
    this.setState({ val: e.target.value });
  };

  async handlePlay() {
    let playing = this.state.playing;
    // if it was paused before
    if (!playing) {
      this.setState({ playing: true });
      let start = parseInt(this.state.val);

      // iterate until you get to present day
      for (let i = 1; i < this.props.num_days - start; i++) {
        let new_val = start + i;
        this.props.update(new_val);
        this.setState({ val: new_val });
        // check to see if it should keep playing after it wakes up
        await sleep(200);
        if (!this.state.playing) {
          break;
        }
      }
      this.setState({ playing: false });
    } else {
      // pause slider
      this.setState({ playing: false });
    }
  }

  render() {
    return (
      <Columns className="is-vcentered">
        <Columns.Column className="is-one-half is-offset-one-quarter">
          <input
            className="slider is-danger is-fullwidth"
            step="1"
            min="0"
            max={this.props.num_days}
            value={this.state.val}
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
    );
  }
}

export default Slider;
