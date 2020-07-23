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
      speed: 800,
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
      this.setState({ playing: true, speed: 800 });
      let start = parseInt(this.state.val);

      // iterate until you get to present day
      for (let i = 1; i < this.props.num_days - start; i++) {
        let new_val = start + i;
        this.props.update(new_val);
        this.setState({ val: new_val });
        // check to see if it should keep playing after it wakes up
        await sleep(this.state.speed);
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
        <Columns.Column className="is-one-half">
          <input
            className="slider is-large is-circle is-danger is-fullwidth"
            step="1"
            min="0"
            max={this.props.num_days}
            value={this.state.val}
            type="range"
            onChange={this.handleSlider}
          />
        </Columns.Column>
        <Columns.Column className="is-one-quarter has-text-centered">
          <Button
            onClick={this.handlePlay}
            className="is-danger is-fullwidth has-text-weight-bold"
          >
            <p>{this.state.playing ? "Pause" : "Play"}</p>
          </Button>
          {this.state.playing && (
            <div className="field has-addons mt-2 is-fullwidth">
              <div className="columns is-fullwidth is-gapless">
                <p className="control column  mx-0">
                  <button
                    onClick={() => this.setState({ speed: 800 })}
                    className={
                      this.state.speed === 800 ? "is-active button" : "button"
                    }
                  >
                    <span className="has-text-weight-bold">x1</span>
                  </button>
                </p>
                <p className="control column mx-0">
                  
                  <button
                    onClick={() => this.setState({ speed: 400 })}
                    className={
                      this.state.speed === 400 ? "is-active button" : "button"
                    }
                  >
                    <span className="has-text-weight-bold">x2</span>
                  </button>
                </p>
                <p className="control column mx-0">
                  <button
                    onClick={() => this.setState({ speed: 200 })}
                    className={
                      this.state.speed === 200 ? "is-active button" : "button"
                    }
                  >
                    <span className="has-text-weight-bold">x4</span>
                  </button>
                </p>
                <p className="control columnmx-0">
                  <button
                    onClick={() => this.setState({ speed: 100 })}
                    className={
                      this.state.speed === 100 ? "is-active button" : "button"
                    }
                  >
                    <span className="has-text-weight-bold">x8</span>
                  </button>
                </p>
              </div>
            </div>
          )}
        </Columns.Column>
      </Columns>
    );
  }
}

export default Slider;
