import React from "react";
import PropTypes from "prop-types";

const LinearGradient = (props) => {
  const { data } = props;
  const boxStyle = {
    width: 240,
    margin: "auto",
  };
  const gradientStyle = {
    backgroundImage: `linear-gradient(to right, ${data.fromColor} , ${data.toColor})`,
    height: 20,
  };
  return (
    <div>
      <div style={boxStyle} className="columns my-0">
        <div className="column is-1">{data.min}</div>
        <span className="column is-10"></span>
        <span className="column is-1">{data.max}</span>
      </div>
      <div style={{ ...boxStyle, ...gradientStyle }}></div>
      <div style={boxStyle} className="has-text-centered mb-4">
        <span>{data.title}</span>
      </div>
    </div>
  );
};

LinearGradient.propTypes = {
  data: PropTypes.object.isRequired,
};

export default LinearGradient;
