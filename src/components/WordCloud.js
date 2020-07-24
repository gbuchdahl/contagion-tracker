import WordCloud from "./wordcloud2";
import React from "react";

class Cloud extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      msg: undefined,
      freqs: []
    };

    // TODO: Construct freqs list from object
    this.convertDocToList = this.convertDocToList.bind(this);
  }

  convertDocToList = () => {
    this.props.val.map((el) => [el.hashtag, el.popularity]);
  }

  componentDidMount() {
    this.updateCanvas();
  }
  updateCanvas() {
    this.setState({"msg": undefined});
    if (this.props.val) {
      this.setState({freqs: this.convertDocToList()});
    }
    else
      console.log("no data");

    const options = {
      list: this.state.freqs,
      fontFamily: "sans-serif",
      ellipticity: 0.4,
      shrinkToFit: true,
      shuffle: true,
      minRotation: 0,
      maxRotation: 0,
      color: (word) => {
        return word.match(/(covid|corona|lockdown|pandemic)/g) ? "#F00" : "#000";
      },
      click: (word) => {
        const url = `https://twitter.com/search?lang=en&q=(%23${word[0].substr(1)})&src=typed_query`;
        window.open(url, '_blank');
      },
      hover: (word, dimension, event) => {
        if (word === undefined) {
          return;
        }
        
        this.setState({msg: "Click on a hashtag to explore it on Twitter."});
      } 
    };

    WordCloud(this.refs.canvas, options);
  }
  render() {
    return (
      <div>
        <canvas ref="canvas" width={600} height={300} />
        { this.state.msg && 
        <p>
        <b>HINT:{" "}</b>
        {this.state.msg}</p>
        }
      </div>
    );
  }
}

export default Cloud;
