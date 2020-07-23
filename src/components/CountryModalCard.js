import React from "react";
import Cloud from "./WordCloud.js";

const CountryModalCard = (props) => {
  let date = new Date(props.date);
  date.setDate(date.getDate() + 1);
  if (props.error === "Document not found") {
    return (
      <div className="modal-card">
        <header className="modal-card-head">
          <p className="modal-card-title">
            <span className="has-text-weight-bold">{props.code}</span>
          </p>
        </header>
        <section className="modal-card-body">
          <p>
            <span className="has-text-weight-bold">Error:</span> Data not found
            for {date.toDateString().slice(4)}.
          </p>
        </section>
      </div>
    );
  }
  if (props.new_cases !== undefined) {
    return (
      <div className="modal-card">
        <header className="modal-card-head">
          <p className="modal-card-title">
            <span className="has-text-weight-bold">{props.location} </span> |{" "}
            {date.toDateString().slice(4)}
          </p>
        </header>
        <section className="modal-card-body">
          <h3 className="has-text-weight-semibold is-size-4 mt-0 mb-2">
            COVID Factsheet
          </h3>
          <div className="columns">
            <div className="column is-5">
              <ul>
                <li>
                  <span className="icon">
                    <i className="fas fa-hospital"></i>
                  </span>
                  <strong> New Cases:</strong>{" "}
                  {props.new_cases.toLocaleString("en")}
                </li>
                <li>
                  <span className="icon">
                    <i className="fas fa-hospital-alt"></i>
                  </span>
                  <strong> Total Cases:</strong>{" "}
                  {props.total_cases.toLocaleString("en")}
                </li>
                <li>
                  <span className="icon">
                    <i className="fas fa-book-dead"></i>
                  </span>
                  <strong> New Deaths:</strong>{" "}
                  {props.new_deaths.toLocaleString("en")}
                </li>
              </ul>
            </div>
            <div className="column">
              <ul>
                <li>
                  <span className="icon">
                    <i className="fas fa-virus"></i>
                  </span>
                  <strong> New Cases Per Million:</strong>{" "}
                  {props.new_cases_per_million.toLocaleString("en")}
                </li>

                <li>
                  <span className="icon">
                    <i className="fas fa-viruses"></i>
                  </span>
                  <strong> Total Cases Per Million:</strong>{" "}
                  {props.total_cases_per_million.toLocaleString("en")}
                </li>
                <li>
                  <span className="icon">
                    <i className="fas fa-skull-crossbones"></i>
                  </span>
                  <strong> New Deaths Per Million:</strong>{" "}
                  {props.new_deaths_per_million.toLocaleString("en")}
                </li>
              </ul>
            </div>
          </div>
          <h3 className="has-text-weight-semibold is-size-4 mt-0 mb-2">
            Regional Viral Trends:
          </h3>
        <Cloud />
        </section>
        <section className="modal-card-foot">
          <p className="button is-warning" onClick={props.handle}>
            Close
          </p>
          {props.location === "United States" && (
            <p className="button is-success" onClick={props.handleUSA}>
              View US Data
            </p>
          )}
        </section>
      </div>
    );
  } else {
    return "";
  }
};

export default CountryModalCard;
