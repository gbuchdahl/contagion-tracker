import WordCloud from "./wordcloud2";
import React from "react";

  class Cloud extends React.Component {
    componentDidMount() {
        this.updateCanvas();
    }
    updateCanvas() {
        const freqs = [['foo', 20], ['bar', 15]];

        const options = {
        list: freqs,
        color: '#000',
        fontFamily: 'sans-serif',
        };

        WordCloud(this.refs.canvas, options);
    }
    render() {
        return (
            <canvas ref="canvas" width={300} height={300}/>
        );
    }
}

export default Cloud;

