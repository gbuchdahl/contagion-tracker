import React from "react";
import Cloud from "./WordCloud.js";

const USModalCard = (props) => {
  let date = new Date(props.date);
  date.setDate(date.getDate() + 1);
  if (props.error === "Document not found") {
    return (
      <div className="modal-card">
        <header className="modal-card-head">
          <p className="modal-card-title">
            <span className="has-text-weight-bold">{props.state}</span>
          </p>
        </header>
        <section className="modal-card-body">
          <p>
            <span className="has-text-weight-bold">Error:</span> Data not found
            for {date.toDateString().slice(4)}.
          </p>
        </section>
        <section className="modal-card-foot">
          <p className="button is-warning" onClick={props.handle}>
            Close
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
                  <span class="icon">
                    <i class="fas fa-vials"></i>
                  </span>
                  <strong> New Tests:</strong>{" "}
                  {props.new_tests.toLocaleString("en")}
                </li>
                <li>
                  <span class="icon">
                    <i class="fas fa-hospital"></i>
                  </span>
                  <strong> New Cases:</strong>{" "}
                  {props.new_cases.toLocaleString("en")}
                </li>
                <li>
                  <span class="icon">
                    <i class="fas fa-hospital-alt"></i>
                  </span>
                  <strong> Total Cases:</strong>{" "}
                  {props.total_cases.toLocaleString("en")}
                </li>
              </ul>
            </div>
            <div className="column">
              <ul>
                <li>
                  <span class="icon">
                    <i class="fas fa-hospital-user"></i>
                  </span>
                  <strong>New Hospitalized:</strong>{" "}
                  {props.new_hospitalized.toLocaleString("en")}
                </li>
                <li>
                  <span class="icon">
                    <i class="fas fa-book-dead"></i>
                  </span>
                  <strong> New Deaths:</strong>{" "}
                  {props.new_deaths.toLocaleString("en")}
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
        </section>
      </div>
    );
  } else {
    return "";
  }
};

// location: "Michigan"
// new_cases: 0
// new_deaths: 0
// new_hospitalized: 0
// new_negatives: 0
// new_tests: 0
// state_code: "MI"
// total_cases: 9
// total_tests: 9
// _id: "5f184f23f60307de2d8521d8"

export default USModalCard;
