import React from "react";
import { Footer, Level } from "react-bulma-components";

const MyFooter = () => {
  return (
    <Footer className="footer">
      <div className="content has-text-left-aligned columns mb-5">
        <div className="mb-5 column is-three-fifths is-offset-one-fifth">
          <strong>Contagion Tracker</strong> is a Skunkworks project designed to
          1) visualize the spread of COVID-19 since inception, and 2) depict how
          COVID-19 has become an inescapable object of our attentions. COVID-19
          data was taken from the{" "}
          <a href="https://www.covidtracking.com/">COVID Tracking Project</a>{" "}
          and&nbsp;
          <a href="https://ourworldindata.org/coronavirus/">
            Our World in Data
          </a>
          . Twitter trends were scraped through calls to the Twitter API via{" "}
          <a href="https://pypi.org/project/GetOldTweets3/">GetOldTweets3</a>.
          You can view the whole project (including source code and more
          detailed documentation){" "}
          <a href="https://github.com/gbuchdahl/contagion-tracker">here</a>.
        </div>
      </div>
      <div>
        <Level className="level">
          <div className="level-item">
            <img src="../../img/mongodb.png" alt="MongoDB" width="200"></img>
          </div>
          <div className="level-item">
            <img src="../../img/react.png" alt="React" width="170"></img>
          </div>
          <div className="level-item">
            <img
              src="../../img/d3.png"
              alt="Javascript D3 Library"
              width="75"
            ></img>
          </div>
          <div className="level-item">
            <img src="../../img/flask.png" alt="Flask" width="175"></img>
          </div>
          <div className="level-item">
            <img
              src="../../img/twitter.png"
              alt="Twitter Developer API"
              width="90"
            ></img>
          </div>
          <div className="level-item">
            <img
              src="../../img/covid_tracking.png"
              alt="COVID Tracking Project"
              width="180"
            ></img>
          </div>
        </Level>
      </div>
    </Footer>
  );
};

export default MyFooter;
