import WordCloud from "./wordcloud2.js";

const freqs = [['foo', 12], ['bar', 6]];

// Gradient Parameters
const options = {
    list: freqs,
    color: '#000',
    fontFamily: 'sans-serif',
  };

const Cloud = () => {
    return WordCloud(document.getElementById('my_canvas'), options)
};

export default Cloud;

